import { Command } from "./input/commands/types";
import { BonusField } from "./units/heroTypes";
import { colorize } from "./util/colorize";

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

export const damageRangeToString = (
  damage: Command["damage"],
  color = true,
) => {
  if (!damage) return "";
  if (typeof damage === "function") damage = damage(0);
  if (!damage) return "";

  let minSum = 0;
  let maxSum = 0;
  let mainDamageType: DamageType = "physical";
  let mainDamageAmount = 0;

  for (const damageType of damageTypes) {
    const minDamage = damage.min[damageType];
    if (minDamage) minSum += minDamage;

    const maxDamage = damage.max[damageType];
    if (maxDamage) {
      maxSum += maxDamage;
      if (maxDamage > mainDamageAmount) {
        mainDamageType = damageType;
        mainDamageAmount = maxDamage;
      }
    }
  }

  const range = `${minSum}-${maxSum}`;

  return color ? colorize[mainDamageType](range) : range;
};
