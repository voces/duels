import { isInTown } from "../../../areas/town2";
import { damageRangeToString, randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { startTimeout } from "../../../util";
import { asyncRequire } from "../../../util/asyncRequire";
import { colorize } from "../../../util/colorize";
import { Vector2Ex } from "../../../util/Vector2";
import { Skill } from "../../types";

const Projectile = asyncRequire<
  typeof import("../../../systems/Projectile")
>("systems.Projectile");

const getDescription = (skill: Skill | undefined) =>
  [
    "Fire Bolt",
    "",
    "Creates a magical flaming missile",
    "",
    `Current Skill Level: ${skill?.level}`,
    "Mana Cost: 3",
    `Fire Damage: ${damageRangeToString(skill?.damage, false)}`,
  ].join("|n");

const damageMin = (level: number) => ({
  fire: Math.round(3.78 + 0.469 * level - 0.0777 * level ** 2),
});

const damageMax = (level: number) => ({
  fire: Math.round(4.96 + 0.834 * level + 0.0898 * level ** 2),
});

const getLongDescription = (skill: Skill | undefined) =>
  [
    colorize.poison("Fire Bolt"),
    "Creates a magical flaming missile",
    "",
    "Mana Cost: 3",
    ...(skill
      ? [
        "",
        `Current Skill Level: ${skill?.level}`,
        `Fire Damage: ${damageRangeToString(skill?.damage, false)}`,
      ]
      : []),
    "",
    skill ? "Next Level" : "First Level",
    `Fire Damage: ${
      damageRangeToString({
        min: damageMin((skill?.level ?? 0) + 1),
        max: damageMax((skill?.level ?? 0) + 1),
      }, false)
    }`,
    "",
    colorize.poison("Fire Bolt Receives Bonuses From:"),
    "Fire Ball: +16% Fire Damage Per Level",
    "Meteor: +16% Fire Damage Per Level",
  ].join("|n");

export const fireBoltSkill = (): Skill => ({
  id: "fireBolt",
  name: "Fire Bolt",
  icon: "ReplaceableTextures/CommandButtons/BTNFlare.blp",
  description: getDescription(undefined),
  longDescription: getLongDescription(undefined),
  level: 0,
  damage: {
    min: { fire: 0 },
    max: { fire: 0 },
  },
  setLevel(newLevel: number) {
    this.level = newLevel;
    this.damage!.min.fire = damageMin(this.level).fire;
    this.damage!.max.fire = damageMax(this.level).fire;
    this.description = getDescription(this);
    this.longDescription = getLongDescription(this);
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
      Projectile.spawnProjectile({
        angle: Vector2Ex.angleBetweenVectors(hero, target),
        damage: randomDamage(this.damage!.min, this.damage!.max),
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
