import type { Hero } from "../units/Hero";
import { restoreHealthHooks } from "./restoreHealth";
import { restoreManaHooks } from "./restoreMana";
import { skillBonusHooks } from "./skillBonus";
import { Effect, EffectHook } from "./types";
import { weaponDamageMultiplierHooks } from "./weaponDamageMultiplier";

const effectMap: { [E in Effect as `${E["type"]}Hooks`]: EffectHook<E> } = {
  skillBonusHooks,
  weaponDamageMultiplierHooks,
  restoreHealthHooks,
  restoreManaHooks,
};

export const applyEffect = (effect: Effect, hero: Hero): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].apply?.(
    effect as any,
    hero,
  );
};

export const unapplyEffect = (effect: Effect, hero: Hero): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].unapply?.(
    effect as any,
    hero,
  );
};

export const useEffect = (effect: Effect, hero: Hero): boolean => {
  const used = "use" in effectMap[`${effect.type}Hooks`];
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].use?.(
    effect as any,
    hero,
  );
  return used;
};
