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
    "Fire Ball",
    "",
    "Creates an explosive sphere of fiery death to engulf your enemies",
    "",
    `Current Skill Level: ${skill?.level}`,
    `Mana Cost: ${manaCost(skill?.level ?? 1)}`,
    `Fire Damage: ${damageRangeToString(skill?.damage, false)}`,
  ].join("|n");

const damageMin = (level: number) => ({
  fire: Math.round(1.79 + 5.22 * level + 0.302 * level ** 2),
});

const damageMax = (level: number) => ({
  fire: Math.round(8.97 + 6.49 * level + 0.302 * level ** 2),
});

const manaCost = (level: number) => 9.5 + 0.5 * level;

const getLongDescription = (skill: Skill | undefined) =>
  [
    colorize.poison("Fire Ball"),
    "Creates an explosive sphere of fiery death to engulf your enemies",
    "",
    "Radius: 2.6 yards",
    ...(skill
      ? [
        "",
        `Current Skill Level: ${skill.level}`,
        `Fire Damage: ${damageRangeToString(skill.damage, false)}`,
        `Mana Cost: ${manaCost(skill.level)}`,
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
    `Mana Cost: ${manaCost(skill?.level ?? 1)}`,
    "",
    colorize.poison("Fire Ball Receives Bonuses From:"),
    "Fire Bolt: +14% Fire Damage Per Level",
    "Meteor: +14% Fire Damage Per Level",
  ].join("|n");

export const fireBallSkill = (): Skill => ({
  id: "fireBall",
  name: "Fire Ball",
  icon: "ReplaceableTextures/CommandButtons/BTNFireBolt.blp",
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
  validate(playerId) {
    if (!state.heroes) return false;
    const hero = state.heroes[playerId];

    if (isInTown(hero)) return false;

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;
    if (target === hero) return false;

    return hero.mana >= manaCost(this.level);
  },
  onUse(playerId, done) {
    if (!state.heroes) return done();
    const hero = state.heroes![playerId];

    hero.mana -= manaCost(this.level);

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
        model: "Abilities/Weapons/RedDragonBreath/RedDragonMissile.mdl",
        owner: hero,
        radius: 128,
        // splashRadius: 256,
        speed: 600,
        x: hero.x,
        y: hero.y,
      });
      // Takes another 490ms to finish backswing
      startTimeout(0.49, done);
    });
  },
});
