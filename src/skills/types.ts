import { Done } from "../actions/queue";
import { Damage } from "../damage";

export interface Skill {
  name: string;
  level: number;
  setLevel: (newLevel: number) => void;
  validate: (playerId: number) => boolean;
  onUse: (playerId: number, done: Done) => void;
  icon: string;
  damage?: {
    min: Damage;
    max: Damage;
  };
}
