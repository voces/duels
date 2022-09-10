import type { Hero } from "../units/Hero";
import { skillBonusHooks } from "./skillBonus";
import { Effect, EffectHook } from "./types";
import { weaponDamageMultiplierHooks } from "./weaponDamageMultiplier";

const effectMap: { [E in Effect as `${E["type"]}Hooks`]: EffectHook<E> } = {
  skillBonusHooks,
  weaponDamageMultiplierHooks,
};

export const applyEffect = (effect: Effect, hero: Hero): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].apply(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effect as any,
    hero,
  );
};

export const unapplyEffect = (effect: Effect, hero: Hero): void => {
  effectMap[`${effect.type}Hooks` as `${Effect["type"]}Hooks`].unapply(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effect as any,
    hero,
  );
};
