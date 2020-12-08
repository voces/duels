import { MapPlayer, Unit } from "../node_modules/w3ts/index";
import { Damage, damageTypes, Weapon } from "./damage";
import { dummyGroup, log } from "./util";

const map = new Map<unit, UnitEx>();

export interface UnitExProps {
	unit: number | string;
	owner: MapPlayer | number;
	x: number;
	y: number;
	facing?: number;
	maxHealth?: number;
	weapon?: Weapon;
	level: number;
}

export class UnitEx {
	readonly unit: Unit;
	private _maxHealth!: number;
	private _health!: number;
	private _weapon!: Weapon;
	private _mana = 0;
	private _maxMana = 0;
	protected _level!: number;

	private listeners: (() => void)[] = [];

	constructor(props: { unit: Unit });
	constructor(props: UnitExProps);
	constructor({
		unit,
		owner,
		x,
		y,
		facing,
		maxHealth = 1,
		weapon = {
			minimumDamage: { physical: 1 },
			maximumDamage: { physical: 1 },
		},
		level,
	}: {
		unit: Unit | number | string;
		owner?: MapPlayer | number;
		x?: number;
		y?: number;
		facing?: number;
		maxHealth?: number;
		weapon?: Weapon;
		level?: number;
	}) {
		if (typeof unit === "number" || typeof unit === "string")
			if (owner == null) throw "Expected owner when passing in unit type";
			else if (x == null) throw "Expected x when passing in unit type";
			else if (y == null) throw "Expected y when passing in unit type";
			else
				unit = new Unit(
					owner,
					typeof unit === "number" ? unit : FourCC(unit),
					// A spot to avoid spawning in a region
					-1056,
					0,
					facing ?? Math.random() * 360,
				);

		if (map.has(unit.handle)) throw "Duplicate UnitEx " + unit.typeId;
		map.set(unit.handle, this);
		this.unit = unit;
		this.maxHealth = maxHealth;
		this.health = maxHealth;
		this.weapon = weapon;

		if (x && y) unit.setPosition(x, y);

		if (typeof level !== "number")
			throw `Expected a level for ${unit.typeId} (${
				typeof owner === "number" ? owner : owner && owner.name
			})`;
		this._level = level;
	}

	public isAlly(whichPlayer: MapPlayer): boolean {
		return IsUnitAlly(this.unit.handle, whichPlayer.handle);
	}

	protected emitChange(): void {
		for (const fn of this.listeners) fn();
	}

	addEventListener(fn: () => void): void {
		this.listeners.push(fn);
	}

	removeEventListener(fn: () => void): void {
		const index = this.listeners.indexOf(fn);
		if (index >= 0) this.listeners.splice(index);
	}

	get health(): number {
		return this._health;
	}
	set health(value: number) {
		this._health = value;
		this.emitChange();
	}

	get maxHealth(): number {
		return this._maxHealth;
	}
	set maxHealth(value: number) {
		this._maxHealth = value;
		this.emitChange();
	}

	get mana(): number {
		return this._mana;
	}
	set mana(value: number) {
		this._mana = value;
	}

	get maxMana(): number {
		return this._maxMana;
	}
	set maxMana(value: number) {
		this._maxMana = value;
	}

	get weapon(): Weapon {
		return this._weapon;
	}
	set weapon(value: Weapon) {
		this._weapon = value;
		this.emitChange();
	}

	// https://web.archive.org/web/20070808072323/http://strategy.diabloii.net/news.php?id=551
	get minimumDamage(): Damage {
		return this.weapon.minimumDamage;
	}

	get maximumDamage(): Damage {
		return this.weapon.maximumDamage;
	}

	get owner(): MapPlayer {
		return this.unit.owner;
	}

	get facing(): number {
		return this.unit.facing;
	}

	set facing(degrees: number) {
		this.unit.facing = degrees;
		this.emitChange();
	}

	setAnimation(whichAnimation: string | number): void {
		this.unit.setAnimation(whichAnimation);
	}

	get x(): number {
		return this.unit.x;
	}

	set x(value: number) {
		this.unit.x = value;
		this.emitChange();
	}

	get y(): number {
		return this.unit.y;
	}

	set y(value: number) {
		this.unit.y = value;
		this.emitChange();
	}

	get handle(): unit {
		return this.unit.handle;
	}

	randomDamage(): Damage {
		const min = this.minimumDamage;
		const max = this.maximumDamage;

		const damage: Damage = {};

		for (const damageType of damageTypes) {
			if (typeof max[damageType] !== "number") continue;
			const lMin = min[damageType] ?? 0;
			const lMax = max[damageType] ?? 0;
			const range = lMax - lMin;

			damage[damageType] = range * Math.random() + lMin;
		}

		return damage;
	}

	damage(target: UnitEx, damage: Damage): void {
		for (const damageType of damageTypes) {
			const damageFromType = damage[damageType];
			if (typeof damageFromType !== "number") continue;
			target.health -= damageFromType;
		}

		if (target.health <= 0) target.unit.kill();
	}

	doMeleeAttack(): void {
		const damage = this.randomDamage();

		const facing = Deg2Rad(this.unit.facing);
		const x = this.unit.x + 64 * Math.cos(facing);
		const y = this.unit.y + 64 * Math.sin(facing);

		let foundAUnit = false;
		dummyGroup.enumUnitsInRange(
			x,
			y,
			128,
			Filter((): boolean => {
				if (foundAUnit) return false;

				const u = UnitEx.fromFilter()!;

				if (u.isAlly(this.unit.owner) || u.health <= 0) return false;
				foundAUnit = true;

				this.damage(u, damage);

				return false;
			}),
		);
		dummyGroup.clear();
	}

	distanceTo(target: UnitEx): number {
		return Math.sqrt(
			(this.unit.y - target.unit.y) ** 2 +
				(this.unit.x - target.unit.x) ** 2,
		);
	}

	public static fromHandle(unit: unit): UnitEx;
	public static fromHandle(unit: null): null;
	public static fromHandle(unit: unit | null): UnitEx | null {
		if (!unit) return null;
		let unitEx = map.get(unit);

		// Hopefully a pre-placed unit
		if (unitEx == null)
			unitEx = new UnitEx({ unit: Unit.fromHandle(unit) });

		// throw "Called UnitEx.fromHandle with an unknown unit";
		return unitEx;
	}

	public static fromUnit(unit: Unit): UnitEx {
		return this.fromHandle(unit.handle);
	}

	public static fromFilter(): UnitEx | null {
		const u = GetFilterUnit();
		if (!u) return null;
		return this.fromHandle(u);
	}

	public static fromEvent(): UnitEx | null {
		const u = GetTriggerUnit();
		if (!u) return null;
		return this.fromHandle(u);
	}

	get level(): number {
		return this._level;
	}
}
