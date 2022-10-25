import { Done } from "../actions/queue";
import { Damage } from "../damage";
import { BonusField } from "../units/heroTypes";
import { UnitEx } from "../units/UnitEx";
import { SkillId } from "./map";

export interface Skill {
  id: SkillId;
  name: string;
  description: () => string;
  longDescription: () => string;
  minHeroLevel?: number;
  level: BonusField<number>;
  unit: UnitEx | undefined;
  canLevel: () => boolean;
  validate: (playerId: number) => boolean;
  onUse: (playerId: number, done: Done) => void;
  icon: string;
  damage?: () => {
    min: Damage;
    max: Damage;
  };
}
