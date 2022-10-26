import { UnitEx } from "../units/UnitEx";

import type { IncreaseManaRegenEffect } from "./increaseManaRegen";
import type { RestoreHealthEffect } from "./restoreHealth";
import type { RestoreManaEffect } from "./restoreMana";
import type { SkillBonusEffect } from "./skillBonus";
import type { WeaponDamageMultiplierEffect } from "./weaponDamageMultiplier";

export type Effect =
  | IncreaseManaRegenEffect
  | RestoreHealthEffect
  | RestoreManaEffect
  | SkillBonusEffect
  | WeaponDamageMultiplierEffect;

export type EffectHook<T> = {
  apply?: (this: void, effect: T, unit: UnitEx) => void;
  unapply?: (this: void, effect: T, unit: UnitEx) => void;
  use?: (this: void, effect: T, unit: UnitEx) => void;
};
