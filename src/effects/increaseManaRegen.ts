import type { EffectHook } from "./types";

export interface IncreaseManaRegenEffect {
  type: "increaseManaRegen";
  percent: number;
  flat: number;
}

export const buildIncreaseManaRegen = (
  overrides: Partial<IncreaseManaRegenEffect>,
): IncreaseManaRegenEffect => ({
  type: "increaseManaRegen",
  percent: 0,
  flat: 0,
  ...overrides,
});

export const increaseManaRegenHooks: EffectHook<
  IncreaseManaRegenEffect
> = {
  apply: (effect, hero): void => {
    hero.addedManaRegen.flat += effect.flat;
    hero.addedManaRegen.percent += effect.percent;
  },
  unapply: (effect, hero): void => {
    hero.addedManaRegen.flat -= effect.flat;
    hero.addedManaRegen.percent -= effect.percent;
  },
};
