import {
	getElapsedTime,
	Group,
	Region,
	Trigger,
} from "../../node_modules/w3ts/index";
import { UnitEx } from "../UnitEx";

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
	}

	spawnUnit(spawn: InternalSpawn): void {
		const time = getElapsedTime();
		const distance =
			Math.random() * spawn.distanceRange + spawn.minDistance;
		const angle = Math.random() * Math.PI * 2;
		const u = new UnitEx({
			unit: spawn.unit,
			owner: randomHostile(),
			x: spawn.x + distance * Math.cos(angle),
			y: spawn.y + distance * Math.sin(angle),
		});
		spawn.units.addUnit(u.unit);
		spawn.last = time;
	}

	activate(): void {
		this.activated = true;
		for (const spawn of this.spawns)
			for (let i = 0; i < spawn.initial; i++) this.spawnUnit(spawn);
	}

	tick(): void {
		const time = getElapsedTime();
		for (const spawn of this.spawns)
			if (
				time - spawn.frequency >= spawn.last &&
				spawn.units.size < spawn.max
			)
				this.spawnUnit(spawn);
	}
}
