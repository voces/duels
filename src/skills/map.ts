import { fireboltSkill } from "./sorceress/fire/firebolt";

export const skillMap = {
  firebolt: fireboltSkill,
};

export type SkillId = keyof typeof skillMap;
