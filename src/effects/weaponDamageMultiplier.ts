import type { DamageType } from "../damage";
import type { EffectHook } from "./types";

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

const map = new WeakMap<
  WeaponDamageMultiplierEffect,
  { min: number; max: number }
>();

export const weaponDamageMultiplierHooks: EffectHook<
  WeaponDamageMultiplierEffect
> = {
  apply: (effect, hero): void => {
    const min = (hero.weapon.min[effect.damageType] ?? 0) +
      (hero.weapon.min.physical ?? 0) * effect.multipler;
    const max = (hero.weapon.max[effect.damageType] ?? 0) +
      (hero.weapon.min.physical ?? 0) * effect.multipler;

    hero.adjustWeaponMinBonus(effect.damageType, min);
    hero.adjustWeaponMaxBonus(effect.damageType, max);

    map.set(effect, { min, max });
  },
  unapply: (effect, hero): void => {
    const { min, max } = map.get(effect);

    hero.adjustWeaponMinBonus(effect.damageType, -min);
    hero.adjustWeaponMaxBonus(effect.damageType, -max);

    map.delete(effect);
  },
};
