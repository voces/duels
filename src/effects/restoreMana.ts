import { EffectHook } from "./types";

export interface RestoreManaEffect {
  type: "restoreMana";
  amount: number;
}

export const buildRestoreMana = (
  overrides: Partial<RestoreManaEffect>,
): RestoreManaEffect => ({
  type: "restoreMana",
  amount: 0,
  ...overrides,
});

export const restoreManaHooks: EffectHook<RestoreManaEffect> = {
  use: (effect, hero) => {
    hero.mana = Math.min(hero.mana + effect.amount, hero.maxMana);
  },
};
