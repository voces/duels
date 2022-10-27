import { isInTown } from "../../../areas/town2";
import { damageRangeToString, randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { BonusField } from "../../../units/heroTypes";
import type { UnitEx as UnitExType } from "../../../units/UnitEx";
import { dummyGroup, startTimeout } from "../../../util";
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
      (1.79 + 5.22 * level + 0.302 * level ** 2) *
        (1 + 0.14 * (skill.unit?.skillMap["fireBolt"]?.level.base ?? 0) +
          0.14 * (skill.unit?.skillMap["meteor"]?.level.base ?? 0)),
    ),
  },
  max: {
    fire: Math.round(
      (8.97 + 6.49 * level + 0.302 * level ** 2) *
        (1 + 0.14 * (skill.unit?.skillMap["fireBolt"]?.level.base ?? 0) +
          0.14 * (skill.unit?.skillMap["meteor"]?.level.base ?? 0)),
    ),
  },
});

const getDescription = (skill: Skill) =>
  [
    "Fire Ball",
    "",
    "Creates an explosive sphere of fiery death to engulf your enemies",
    "",
    `Current Skill Level: ${skill.level.total}`,
    `Mana Cost: ${manaCost(skill.level.total)}`,
    `Fire Damage: ${
      damageRangeToString(getDamage(skill.level.total, skill), false)
    }`,
  ].join("|n");

const manaCost = (level: number) => 9.5 + 0.5 * level;

const getLongDescription = (skill: Skill) =>
  [
    colorize.poison("Fire Ball"),
    "Creates an explosive sphere of fiery death to engulf your enemies",
    "",
    "Radius: 2.6 yards",
    ...(skill.level.total > 0
      ? [
        "",
        `Current Skill Level: ${skill.level.total}${
          skill.level.bonus > 0 ? ` (Base: ${skill.level.base})` : ""
        }`,
        `Fire Damage: ${
          damageRangeToString(getDamage(skill.level.total, skill), false)
        }`,
        `Mana Cost: ${manaCost(skill.level.total)}`,
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
          `Mana Cost: ${manaCost(skill.level.total + 1)}`,
        ]
        : []
    ),
    "",
    colorize.poison("Fire Ball Receives Bonuses From:"),
    "Fire Bolt: +14% Fire Damage Per Level",
    "Meteor: +14% Fire Damage Per Level",
  ].join("|n");

const UnitEx = asyncRequire<
  typeof import("../../../units/UnitEx")
>("units.UnitEx");

export const fireBallSkill = (unit: UnitExType | undefined): Skill => ({
  id: "inferno",
  type: "active",
  name: "Fire Ball",
  icon: "ReplaceableTextures/CommandButtons/BTNFireBolt.blp",
  description() {
    return getDescription(this);
  },
  longDescription() {
    return getLongDescription(this);
  },
  level: new BonusField(0),
  minHeroLevel: 12,
  unit,
  canLevel() {
    return ((this.unit?.level ?? 0) >=
      (this.minHeroLevel ?? 0) + this.level.base) &&
      (this.unit?.skillMap.fireBolt?.level.base ?? 0) > 0 &&
      this.level.base < 20;
  },
  validate(playerId) {
    if (!state.heroes) return false;
    const hero = state.heroes[playerId];

    if (isInTown(hero)) return false;

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;
    if (target === hero) return false;

    return hero.mana >= manaCost(this.level.total);
  },
  onUse(playerId, done) {
    if (!state.heroes) return done();
    const hero = state.heroes![playerId];

    hero.mana -= manaCost(this.level.total);

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;

    hero.unit.issueImmediateOrder("stop");
    hero.faceTarget(target);
    hero.setAnimation("spell");
    startTimeout(0.51, () => {
      if (hero.health === 0) return;
      Projectile.spawnProjectile({
        angle: Vector2Ex.angleBetweenVectors(hero, target),
        duration: 2.5,
        model: "Abilities/Weapons/RedDragonBreath/RedDragonMissile.mdl",
        owner: hero,
        radius: 128,
        speed: 600,
        x: hero.x,
        y: hero.y,
        onHit: (_, p) => {
          const { min, max } = getDamage(this.level.total, this);
          const damage = randomDamage(min, max);
          dummyGroup.enumUnitsInRange(
            p.x,
            p.y,
            256,
            (): boolean => {
              const u = UnitEx.UnitEx.fromFilter()!;
              if (u.isAlly(hero.owner) || u.health <= 0) return false;

              hero.damage(u, damage);

              return false;
            },
          );
        },
      });
      // Takes another 490ms to finish backswing
      startTimeout(0.49, done);
    });
  },
});
