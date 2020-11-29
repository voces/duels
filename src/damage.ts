export interface Damage {
	physical?: number;
	magic?: number;
	fire?: number;
	lightning?: number;
	poison?: number;
	ice?: number;
}

export const damageTypes = [
	"physical",
	"magic",
	"fire",
	"lightning",
	"poison",
	"ice",
] as const;

export interface Weapon {
	minimumDamage: Damage;
	maximumDamage: Damage;
}
