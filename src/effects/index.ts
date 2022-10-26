import type { Effect, EffectHook } from "./types";
import { UnitEx } from "../units/UnitEx";

import { increaseManaRegenHooks } from "./increaseManaRegen";
import { restoreHealthHooks } from "./restoreHealth";
import { restoreManaHooks } from "./restoreMana";
import { skillBonusHooks } from "./skillBonus";
import { weaponDamageMultiplierHooks } from "./weaponDamageMultiplier";

const effectMap: { [E in Effect as `${E["type"]}Hooks`]: EffectHook<E> } = {
  increaseManaRegenHooks,
  restoreHealthHooks,
  restoreManaHooks,
  skillBonusHooks,
  weaponDamageMultiplierHooks,
};

export const applyEffect = (effect: Effect, unit: UnitEx): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].apply?.(
    effect as any,
    unit,
  );
};

export const unapplyEffect = (effect: Effect, unit: UnitEx): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].unapply?.(
    effect as any,
    unit,
  );
};

export const useEffect = (effect: Effect, unit: UnitEx): boolean => {
  const used = "use" in effectMap[`${effect.type}Hooks`];
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].use?.(
    effect as any,
    unit,
  );
  return used;
};
