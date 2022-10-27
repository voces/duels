import { isInTown } from "../../../areas/town2";
import { damageRangeToString, randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { BonusField } from "../../../units/heroTypes";
import { UnitEx } from "../../../units/UnitEx";
import { startTimeout } from "../../../util";
import { asyncRequire } from "../../../util/asyncRequire";
import { colorize } from "../../../util/colorize";
import { Vector2Ex } from "../../../util/Vector2";
import { Skill } from "../../types";

const Projectile = asyncRequire<
  typeof import("../../../systems/Projectile")
>("systems.Projectile");

const getDamage = (level: number, skill: Skill) => ({
  min: {
    fire: Math.round(
      (3.21 + 0.652 * level + 0.0679 * level ** 2) *
        (1 + 0.16 * (skill.unit?.skillMap["fireBall"]?.level.base ?? 0) +
          0.16 ** (skill.unit?.skillMap["meteor"]?.level.base ?? 0)),
    ),
  },
  max: {
    fire: Math.round(
      (6.12 + 0.466 * level + 0.109 * level ** 2) *
        (1 + 0.16 * (skill.unit?.skillMap["fireBall"]?.level.base ?? 0) +
          0.16 ** (skill.unit?.skillMap["meteor"]?.level.base ?? 0)),
    ),
  },
});

const getDescription = (skill: Skill) =>
  [
    "Fire Bolt",
    "",
    "Creates a magical flaming missile",
    "",
    `Current Skill Level: ${skill.level.total}`,
    "Mana Cost: 3",
    `Fire Damage: ${
      damageRangeToString(getDamage(skill.level.total, skill), false)
    }`,
  ].join("|n");

const getLongDescription = (skill: Skill) =>
  [
    colorize.poison("Fire Bolt"),
    "Creates a magical flaming missile",
    "",
    "Mana Cost: 3",
    ...(skill.level.total > 0
      ? [
        "",
        `Current Skill Level: ${skill.level.total}${
          skill.level.bonus > 0 ? ` (Base: ${skill.level.base})` : ""
        }`,
        `Fire Damage: ${
          damageRangeToString(getDamage(skill.level.total, skill), false)
        }`,
      ]
      : []),
    ...(
      skill.level.total === 0 || skill.canLevel()
        ? [
          "",
          skill.level.total === 0 ? "First Level" : "Next Level",
          `Fire Damage: ${
            damageRangeToString(getDamage(skill.level.total + 1, skill), false)
          }`,
        ]
        : []
    ),
    "",
    colorize.poison("Fire Bolt Receives Bonuses From:"),
    "Fire Ball: +16% Fire Damage Per Level",
    "Meteor: +16% Fire Damage Per Level",
  ].join("|n");

export const fireBoltSkill = (unit: UnitEx | undefined): Skill => ({
  id: "fireBolt",
  type: "active",
  name: "Fire Bolt",
  icon: "ReplaceableTextures/CommandButtons/BTNFlare.blp",
  description() {
    return getDescription(this);
  },
  longDescription() {
    return getLongDescription(this);
  },
  level: new BonusField(0),
  unit,
  canLevel() {
    return this.level.base < 20 &&
      (this.unit ? this.unit.level >= this.level.base : false);
  },
  validate: (playerId) => {
    if (!state.heroes) return false;
    const hero = state.heroes[playerId];

    if (isInTown(hero)) return false;

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;
    if (target === hero) return false;

    return hero.mana >= 3;
  },
  onUse(playerId, done) {
    if (!state.heroes) return done();
    const hero = state.heroes![playerId];

    hero.mana -= 3;

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;

    hero.unit.issueImmediateOrder("stop");
    hero.faceTarget(target);
    hero.setAnimation("spell");
    startTimeout(0.51, () => {
      if (hero.health === 0) return;
      const { min, max } = getDamage(this.level.total, this);
      Projectile.spawnProjectile({
        angle: Vector2Ex.angleBetweenVectors(hero, target),
        damage: randomDamage(min, max),
        duration: 2.5,
        model: "Abilities/Weapons/FireBallMissile/FireBallMissile.mdl",
        owner: hero,
        radius: 96,
        speed: 700,
        x: hero.x,
        y: hero.y,
      });
      // Takes another 490ms to finish backswing
      startTimeout(0.49, done);
    });
  },
});
