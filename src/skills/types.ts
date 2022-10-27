import { Done } from "../actions/queue";
import { Damage } from "../damage";
import { Effect } from "../effects/types";
import { BonusField } from "../units/heroTypes";
import { UnitEx } from "../units/UnitEx";
import { SkillId } from "./map";

type BaseSkill = {
  id: SkillId;
  name: string;
  description: () => string;
  longDescription: () => string;
  minHeroLevel?: number;
  level: BonusField<number>;
  unit: UnitEx | undefined;
  canLevel: () => boolean;
  icon: string;
};

export type ActiveSkill = BaseSkill & {
  type: "active";
  validate: (playerId: number) => boolean;
  onUse: (playerId: number, done: Done) => void;
};

export type PassiveSkill = BaseSkill & {
  type: "passive";
  effects: () => Effect[];
};

export type Skill = ActiveSkill | PassiveSkill;
