import { fireboltSkill } from "./sorceress/fire/firebolt";

export const skillMap = {
  Firebolt: fireboltSkill,
};

export type SkillName = keyof typeof skillMap;
