import type { Hero } from "../units/Hero";
import type { SkillBonusEffect } from "./skillBonus";
import { skillBonusHooks } from "./skillBonus";
import type { WeaponDamageMultiplierEffect } from "./weaponDamageMultiplier";
import { weaponDamageMultiplierHooks } from "./weaponDamageMultiplier";

export type Effect = SkillBonusEffect | WeaponDamageMultiplierEffect;

const effectMap: {
  [E in Effect as `${E["type"]}Hooks`]: {
    apply: (this: void, effect: E, hero: Hero) => void;
    unapply: (this: void, effect: E, hero: Hero) => void;
  };
} = { skillBonusHooks, weaponDamageMultiplierHooks };

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
