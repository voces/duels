import { fireBallSkill } from "./sorceress/fire/fireBall";
import { fireBoltSkill } from "./sorceress/fire/fireBolt";
import { infernoSkill } from "./sorceress/fire/inferno";
import { warmthSkill } from "./sorceress/fire/warmth";

export const skillMap = {
  blaze: fireBoltSkill, // Flame Strike
  blizzard: fireBoltSkill, // Blizzard
  chainLightning: fireBoltSkill, // Chain Lightning
  chargedBolt: fireBoltSkill,
  chillingArmor: fireBoltSkill,
  coldMastery: fireBoltSkill,
  enchant: fireBoltSkill,
  energyShield: fireBoltSkill,
  fireBall: fireBallSkill, // Fire Bolt
  fireBolt: fireBoltSkill, // Flare
  fireMastery: fireBoltSkill,
  fireWall: fireBoltSkill, // Aerial Shackles
  frostNova: fireBoltSkill,
  frozenArmor: fireBoltSkill,
  frozenOrb: fireBoltSkill,
  glacialSpike: fireBoltSkill,
  hydra: fireBoltSkill, // Serpent Ward
  iceBlast: fireBoltSkill,
  iceBolt: fireBoltSkill,
  inferno: infernoSkill, // Resurrection
  lightning: fireBoltSkill,
  lightningMastery: fireBoltSkill,
  meteor: fireBoltSkill, // Disenchant
  nova: fireBoltSkill,
  shiverArmor: fireBoltSkill,
  staticField: fireBoltSkill,
  telekinesis: fireBoltSkill,
  teleport: fireBoltSkill,
  thunderstorm: fireBoltSkill,
  warmth: warmthSkill, // Phoenix
};

export type SkillId = keyof typeof skillMap;
