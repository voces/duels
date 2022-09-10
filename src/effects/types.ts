import type { Hero } from "../units/Hero";
import type { SkillBonusEffect } from "./skillBonus";
import type { WeaponDamageMultiplierEffect } from "./weaponDamageMultiplier";

export type Effect = SkillBonusEffect | WeaponDamageMultiplierEffect;

export type EffectHook<T> = {
  apply: (this: void, effect: T, hero: Hero) => void;
  unapply: (this: void, effect: T, hero: Hero) => void;
};
