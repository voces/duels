import { BonusField } from "./units/heroTypes";

export type Damage = {
  physical?: number;
  magic?: number;
  fire?: number;
  lightning?: number;
  poison?: number;
  cold?: number;
  holy?: number;
};

export const damageTypes = [
  "physical",
  "magic",
  "fire",
  "lightning",
  "poison",
  "cold",
  "holy",
] as const;

export type DamageType = typeof damageTypes[number];

export interface WeaponInput {
  min: Damage;
  max: Damage;
  projectile?: string;
  projectileSpeed?: number;
}

export interface Weapon {
  min: BonusField<Damage>;
  max: BonusField<Damage>;
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

let damageSystemOn = true;

export const withDamageSystemOff = (fn: () => void): void => {
  const prev = damageSystemOn;
  damageSystemOn = false;
  fn();
  damageSystemOn = prev;
};

export const isDamageSystemOn = (): boolean => damageSystemOn;
