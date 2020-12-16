import { DamageType } from "../damage";

export interface WeaponDamageMultiplierEffect {
	type: "weaponDamageMultiplier";
	damageType: DamageType;
	multipler: number;
}

export const buildWeaponDamageMultiplierEffect = (
	overrides: Partial<WeaponDamageMultiplierEffect>,
): WeaponDamageMultiplierEffect => ({
	type: "weaponDamageMultiplier",
	damageType: "physical",
	multipler: 1,
	...overrides,
});

// effects are part of weapon damage calculator
export const weaponDamageMultiplierHooks = {
	apply: (...args: any[]): void => {
		// do nothing
	},
	unapply: (): void => {
		// do nothing
	},
};
