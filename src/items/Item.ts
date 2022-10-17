import { Effect } from "../effects/types";
import { Affix } from "./affixes/types";

export type Item = {
  slot:
    | "hands"
    | "mainHand"
    | "offHand"
    | "potion"
    | "head"
    | "boots"
    | "armor"
    | "belt"
    | "amulet"
    | "mainRing"
    | "offRing"
    | "gloves";
  name: string;
  image: string;
  consumable?: boolean;
  damage?: { min: number; max: number };
  durability?: number;
  sockets?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  attackSpeed?: number;
  affixes?: Affix[];
  effects?: Effect[];
  stacks?: number;
};
