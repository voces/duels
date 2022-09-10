import type { DamageType } from "../damage";

export interface WeaponDamageEffect {
  type: "weaponDamage";
  damageType: DamageType;
  multipler: number;
}

export const buildWeaponDamageEffect = (
  overrides: Partial<WeaponDamageEffect>,
): WeaponDamageEffect => ({
  type: "weaponDamage",
  damageType: "physical",
  multipler: 1,
  ...overrides,
});

// effects are part of weapon damage calculator
export const weaponDamageHooks = {
  apply: (...args: any[]): void => {
    // do nothing
  },
  unapply: (): void => {
    // do nothing
  },
};
