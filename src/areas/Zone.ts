import {
	addScriptHook,
	getElapsedTime,
	Group,
	Region,
	Timer,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { isHeroType } from "../units/heroTypes";
import { UnitEx, UnitExProps } from "../units/UnitEx";
import { startTimeout } from "../util";

type InnerSpawnUnitProps = Omit<UnitExProps, "x" | "y" | "owner">;

type SpawnUnitProps = {
	[key in keyof Omit<UnitExProps, "x" | "y" | "owner">]:
		| UnitExProps[key]
		| (() => UnitExProps[key]);
};

export interface Spawn {
	x: number;
	y: number;
	initial: number;
	frequency: number;
	max: number;
	minDistance?: number;
	maxDistance?: number;
	unitData: SpawnUnitProps;
}

interface InternalSpawn extends Spawn {
	minDistance: number;
	distanceRange: number;
	units: Group;
	last: number;
}

const randomHostile = () => 16 + Math.floor(Math.random() * 8);

const zones: Zone[] = [];

const unitSpawnMap = new Map<UnitEx, Group>();

export class Zone {
	players = 0;
	activated = false;
	spawns: InternalSpawn[];

	constructor(readonly region: Region, spawns: Spawn[]) {
		const last = getElapsedTime();
		this.spawns = spawns.map((spawn) => ({
			...spawn,
			minDistance: spawn.minDistance ?? 0,
			distanceRange: Math.max(
				(spawn.maxDistance ?? 0) - (spawn.minDistance ?? 0),
				0,
			),
			units: new Group(),
			last,
		}));

		const t = new Trigger();
		t.registerEnterRegion(
			region.handle,
			Filter(() => {
				if (UnitEx.fromFilter()!.owner.id >= 16) return false;

				this.players++;
				if (this.players === 1 && !this.activated) this.activate();

				return false;
			}),
		);
		t.registerLeaveRegion(
			region.handle,
			Filter(() => {
				if (UnitEx.fromFilter()!.owner.id >= 16) return false;

				this.players--;

				return false;
			}),
		);

		zones.push(this);
	}

	spawnUnit(spawn: InternalSpawn, time = getElapsedTime()): void {
		const distance =
			Math.random() * spawn.distanceRange + spawn.minDistance;
		const angle = Math.random() * Math.PI * 2;
		const x = spawn.x + distance * Math.cos(angle);
		const y = spawn.y + distance * Math.sin(angle);
		const owner = randomHostile();

		const data = { ...spawn.unitData };
		let prop: keyof typeof data;
		for (prop in data) {
			const value = data[prop];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (typeof value === "function") data[prop] = value() as any;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const builtData: InnerSpawnUnitProps = data as any;

		const u = new UnitEx({
			owner,
			x,
			y,
			...builtData,
		});
		spawn.units.addUnit(u.unit);
		spawn.last = time;
		unitSpawnMap.set(u, spawn.units);
	}

	activate(time = getElapsedTime()): void {
		this.activated = true;
		for (const spawn of this.spawns)
			for (let i = 0; i < spawn.initial; i++) this.spawnUnit(spawn, time);
	}

	tick(time = getElapsedTime()): void {
		for (const spawn of this.spawns)
			if (
				time - spawn.frequency >= spawn.last &&
				spawn.units.size < spawn.max
			)
				this.spawnUnit(spawn);
	}
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	new Timer().start(1, true, () => {
		const time = getElapsedTime();
		for (const zone of zones) if (zone.activated) zone.tick(time);
	});

	const t = new Trigger();
	t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
	t.addCondition(() => {
		const u = UnitEx.fromEvent()!;
		const group = unitSpawnMap.get(u);
		if (!isHeroType(u) && group)
			startTimeout(90, () => {
				u.unit.destroy();
				group.removeUnit(u.unit);
			});
		return false;
	});
});
