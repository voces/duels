import { getElapsedTime, MapPlayer, Unit } from "../node_modules/w3ts/index";
import { queueAction } from "./actions/queue";
import { Damage, damageTypes, randomDamage, Weapon } from "./damage";
import { registerCommand } from "./input/commands/registry";
import { Skill } from "./skills/types";
import { dummyGroup } from "./util";
import { Vector2, Vector2Ex } from "./util/Vector2";

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
	private _maxHealth = 0;
	private _health = 0;
	private _weapon!: Weapon;
	private _mana = 0;
	private _maxMana = 0;
	protected _level = 0;
	private _skills: Skill[] = [];

	private listeners: (() => void)[] = [];
	private lastHealthLoss = 0;

	constructor(props: { unit: Unit });
	constructor(props: UnitExProps);
	constructor({
		unit,
		owner,
		x,
		y,
		facing,
		maxHealth = 1,
		weapon = { min: { physical: 1 }, max: { physical: 1 } },
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

		if (maxHealth) {
			this.maxHealth = maxHealth;
			this.health = maxHealth;
		}
		if (weapon) this.weapon = weapon;

		if (x && y) unit.setPosition(x, y);

		if (level) this._level = level;
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
		const oldValue = this._health;
		if (value < this._health) this.lastHealthLoss = getElapsedTime();
		this._health = value;
		// Only re-render and unit changes
		if (Math.floor(value) !== Math.floor(oldValue)) this.emitChange();
	}

	get maxHealth(): number {
		return this._maxHealth;
	}
	set maxHealth(value: number) {
		const delta = value - this._maxHealth;
		this._maxHealth += delta;
		this._health += delta;
		this.emitChange();
	}

	get healthRegen(): number {
		return this.lastHealthLoss + 5 > getElapsedTime() ? 1 : 0;
	}

	get mana(): number {
		return this._mana;
	}
	set mana(value: number) {
		const oldValue = this._mana;
		this._mana = value;
		// Only re-render and unit changes
		if (Math.floor(value) !== Math.floor(oldValue)) this.emitChange();
	}

	get maxMana(): number {
		return this._maxMana;
	}
	set maxMana(value: number) {
		const delta = value - this._maxMana;
		this._maxMana += delta;
		this._mana += delta;
		this.emitChange();
	}

	get manaRegen(): number {
		return this.maxMana / 120;
	}

	get weapon(): Weapon {
		return this._weapon;
	}
	set weapon(value: Weapon) {
		this._weapon = value;
		this.emitChange();
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
		return randomDamage(this.weapon.min, this.weapon.max);
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

	addSkill(skill: Skill): void {
		this._skills.push(skill);
		registerCommand(
			{
				name: skill.name,
				shortcuts: [{ mouse: "right" }],
				damage: skill.damage,
				fn: (playerId) => {
					if (!skill.validate(playerId)) return false;
					queueAction(playerId, {
						perform: (done) => skill.perform(playerId, done),
						interruptable: false,
					});
					return true;
				},
			},
			this.owner.id,
		);
	}

	faceTarget(target: Vector2): void {
		const angle = Rad2Deg(Vector2Ex.angleBetweenVectors(this, target));
		this.unit.facing = angle;
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
