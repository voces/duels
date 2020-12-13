export interface Damage {
	physical?: number;
	magic?: number;
	fire?: number;
	lightning?: number;
	poison?: number;
	cold?: number;
}

export const damageTypes = [
	"physical",
	"magic",
	"fire",
	"lightning",
	"poison",
	"cold",
] as const;

export type DamageType = typeof damageTypes[number];

export interface Weapon {
	min: Damage;
	max: Damage;
	projectile?: string;
	projectileSpeed?: number;
}

export const randomDamage = (min: Damage, max: Damage): Damage => {
	const damage: Damage = {};

	for (const damageType of damageTypes) {
		if (typeof max[damageType] !== "number") continue;
		const lMin = min[damageType] ?? 0;
		const lMax = max[damageType] ?? 0;
		const range = lMax - lMin;

		damage[damageType] = range * Math.random() + lMin;
	}

	return damage;
};
