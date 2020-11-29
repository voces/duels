import { MapPlayer, Unit } from "../node_modules/w3ts/index";
import { Damage, damageTypes, Weapon } from "./damage";
import { dummyGroup } from "./util";

const map = new Map<unit, UnitEx>();

export class UnitEx {
	unit: Unit;
	maxHealth: number;
	health: number;

	weapon: Weapon;

	constructor({
		unit,
		owner,
		x,
		y,
		facing,
		maxHealth = 1,
		weapon = { minimumDamage: {}, maximumDamage: {} },
	}: {
		unit: Unit | number | string;
		owner?: MapPlayer | number;
		x?: number;
		y?: number;
		facing?: number;
		maxHealth?: number;
		weapon?: Weapon;
	}) {
		if (typeof unit === "number" || typeof unit === "string")
			if (owner == null) throw "Expected owner when passing in unit type";
			else if (x == null) throw "Expected x when passing in unit type";
			else if (y == null) throw "Expected y when passing in unit type";
			else
				unit = new Unit(
					owner,
					typeof unit === "number" ? unit : FourCC(unit),
					x,
					y,
					facing ?? Math.random() * 360,
				);

		if (map.has(unit.handle)) throw "Duplicate UnitEx";
		map.set(unit.handle, this);
		this.unit = unit;
		this.maxHealth = maxHealth;
		this.health = maxHealth;
		this.weapon = weapon;
	}

	public isAlly(whichPlayer: MapPlayer): boolean {
		return IsUnitAlly(this.unit.handle, whichPlayer.handle);
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
	}

	setAnimation(whichAnimation: string | number): void {
		this.unit.setAnimation(whichAnimation);
	}

	get x(): number {
		return this.unit.x;
	}

	set x(value: number) {
		this.unit.x = value;
	}

	get y(): number {
		return this.unit.y;
	}

	set y(value: number) {
		this.unit.y = value;
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

			max[damageType] = range * Math.random() + lMin;
		}

		return damage;
	}

	damage(target: UnitEx, damage: Damage): void {
		for (const damageType of damageTypes) {
			const damageFromType = damage[damageType];
			if (typeof damageFromType !== "number") continue;
			target.health -= damageFromType;
		}

		if (target.health < 0) target.unit.setAnimation("death");
	}

	doMeleeArea(): void {
		const damage = this.randomDamage();

		const facing = Deg2Rad(this.unit.facing);
		const x = this.unit.x + 64 * Math.cos(facing);
		const y = this.unit.y + 64 * Math.sin(facing);

		dummyGroup.enumUnitsInRange(
			x,
			y,
			128,
			Filter((): boolean => {
				const u = UnitEx.fromFilter()!;
				if (u.isAlly(this.unit.owner) || u.health < 0) return false;

				this.damage(u, damage);

				return false;
			}),
		);
	}

	public static fromHandle(unit: unit): UnitEx;
	public static fromHandle(unit: null): null;
	public static fromHandle(unit: unit | null): UnitEx | null {
		if (!unit) return null;
		const unitEx = map.get(unit);
		if (unitEx == null)
			throw "Called UnitEx.fromHandle with an unknown unit";
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
}
