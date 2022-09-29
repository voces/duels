import type { Hero } from "../units/Hero";
import type { RestoreHealthEffect } from "./restoreHealth";
import type { RestoreManaEffect } from "./restoreMana";
import type { SkillBonusEffect } from "./skillBonus";
import type { WeaponDamageMultiplierEffect } from "./weaponDamageMultiplier";

export type Effect =
  | SkillBonusEffect
  | WeaponDamageMultiplierEffect
  | RestoreHealthEffect
  | RestoreManaEffect;

export type EffectHook<T> = {
  apply?: (this: void, effect: T, hero: Hero) => void;
  unapply?: (this: void, effect: T, hero: Hero) => void;
  use?: (this: void, effect: T, hero: Hero) => void;
};
