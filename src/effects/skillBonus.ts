import type { SkillName } from "../skills/map";
import type { Hero } from "../units/Hero";

export interface SkillBonusEffect {
  type: "skillBonus";
  skill: SkillName;
  levels: number;
}

export const skillBonusHooks = {
  apply: (effect: SkillBonusEffect, hero: Hero): void => {
    hero.incSkillLevel(effect.skill, effect.levels);
  },
  unapply: (effect: SkillBonusEffect, hero: Hero): void => {
    hero.incSkillLevel(effect.skill, -effect.levels);
  },
};
