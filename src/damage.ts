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

export type DamageRange = { min: Damage; max: Damage };

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

export const damageScale = (damage: Damage, scalar: number): Damage =>
  Object.fromEntries(
    Object.entries(damage).map(([type, amount]) => [type, amount * scalar]),
  );

let damageSystemOn = true;

export const withDamageSystemOff = (fn: () => void): void => {
  const prev = damageSystemOn;
  damageSystemOn = false;
  fn();
  damageSystemOn = prev;
};

export const isDamageSystemOn = (): boolean => damageSystemOn;

export const damageRangeToString = (
  damageRange: Command["damage"],
  color = true,
) => {
  if (!damageRange) return "";
  if (typeof damageRange === "function") damageRange = damageRange(0);
  if (!damageRange) return "";

  let minSum = 0;
  let maxSum = 0;
  let mainDamageType: DamageType = "physical";
  let mainDamageAmount = 0;

  for (const damageType of damageTypes) {
    const minDamage = damageRange.min[damageType];
    if (minDamage) minSum += minDamage;

    const maxDamage = damageRange.max[damageType];
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
