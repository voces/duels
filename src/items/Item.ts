import { Effect } from "../effects/types";
import { Affix } from "./affixes/types";

export type Item = {
  slot: "hands" | "leftHand" | "rightHand";
  slotSize: { width: number; height: number };
  damage: { min: number; max: number };
  durability: number;
  sockets: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  attackSpeed: number;
  affixes: Affix[];
  effects: Effect[];
};
