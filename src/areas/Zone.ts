import {
	addScriptHook,
	getElapsedTime,
	Group,
	Region,
	Timer,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { isHeroType } from "../types";
import { UnitEx } from "../UnitEx";
import { startTimeout } from "../util";

export interface Spawn {
	x: number;
	y: number;
	unit: number | string;
	initial: number;
	frequency: number;
	max: number;
	minDistance?: number;
	maxDistance?: number;
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
		const u = new UnitEx({
			unit: spawn.unit,
			owner,
			x,
			y,
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
		if (!isHeroType(u))
			startTimeout(90, () => {
				u.unit.destroy();
				const group = unitSpawnMap.get(u);
				group?.removeUnit(u.unit);
			});
		return false;
	});
});