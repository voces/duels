import { EffectHook } from "./types";

export interface RestoreHealthEffect {
  type: "restoreHealth";
  amount: number;
}

export const buildRestoreHealth = (
  overrides: Partial<RestoreHealthEffect>,
): RestoreHealthEffect => ({
  type: "restoreHealth",
  amount: 0,
  ...overrides,
});

export const restoreHealthHooks: EffectHook<RestoreHealthEffect> = {
  use: (effect, hero) => {
    hero.health = Math.min(hero.health + effect.amount, hero.maxHealth);
  },
};
