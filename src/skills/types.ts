import { Done } from "../actions/queue";
import { Damage } from "../damage";

export interface Skill {
  name: string;
  level: number;
  setLevel: (newLevel: number) => void;
  validate: (playerId: number) => boolean;
  perform: (playerId: number, done: Done) => void;
  damage?: {
    min: Damage;
    max: Damage;
  };
}
