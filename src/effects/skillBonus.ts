import type { SkillId } from "../skills/map";
import type { EffectHook } from "./types";

export interface SkillBonusEffect {
  type: "skillBonus";
  skill: SkillId;
  levels: number;
}

export const skillBonusHooks: EffectHook<SkillBonusEffect> = {
  apply: (effect, hero) => hero.incSkillLevel(effect.skill, effect.levels),
  unapply: (effect, hero) => hero.incSkillLevel(effect.skill, -effect.levels),
};
