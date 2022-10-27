import { isInTown } from "../../../areas/town2";
import {
  damageRangeToString,
  damageScale,
  randomDamage,
} from "../../../damage";
import { inputUnchanged, keyboards, mice } from "../../../input/data";
import { state } from "../../../states/state";
import { BonusField } from "../../../units/heroTypes";
import type { UnitEx as UnitExType } from "../../../units/UnitEx";
import { startInterval, startTimeout } from "../../../util";
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
      (5.06 + 8.09 * level + 0.126 * level ** 2) *
        (1 + 0.16 * (skill.unit?.skillMap["warmth"]?.level.base ?? 0)),
    ),
  },
  max: {
    fire: Math.round(
      (18.6 + 8.36 * level + 0.131 * level ** 2) *
        (1 + 0.16 * (skill.unit?.skillMap["warmth"]?.level.base ?? 0)),
    ),
  },
});

const manaCost = (level: number) => Math.round(4.29 + 0.171 * level);

const getRange = (level: number) => Math.round(49.9 + 5.06 * level) / 10;

const getDescription = (skill: Skill) =>
  [
    "Inferno",
    "",
    "Creates a continuous jet of flame to scorch your enemies",
    "",
    `Current Skill Level: ${skill.level.total}`,
    "Minimum Mana Required to Cast: 4",
    `Average Fire Damage: ${
      damageRangeToString(getDamage(skill.level.total, skill), false)
    } per second`,
    `Range: ${getRange(skill.level.total)} yards`,
    `Mana Cost: ${manaCost(skill.level.total)}`,
  ].join("|n");

const getLongDescription = (skill: Skill) =>
  [
    colorize.poison("Inferno"),
    "Creates a continuous jet of flame to scorch your enemies",
    ...(skill.level.total > 0
      ? [
        "",
        `Current Skill Level: ${skill.level.total}${
          skill.level.bonus > 0 ? ` (Base: ${skill.level.base})` : ""
        }`,
        `Average Fire Damage: ${
          damageRangeToString(getDamage(skill.level.total, skill), false)
        } per second`,
        `Range: ${getRange(skill.level.total)} yards`,
        `Mana Cost: ${manaCost(skill.level.total)} per second`,
      ]
      : []),
    ...(
      skill.level.total === 0 || skill.canLevel()
        ? [
          "",
          skill.level.total === 0 ? "First Level" : "Next Level",
          `Average Fire Damage: ${
            damageRangeToString(getDamage(skill.level.total + 1, skill), false)
          } per second`,
          `Range: ${getRange(skill.level.total + 1)} yards`,
          `Mana Cost: ${manaCost(skill.level.total + 1)} per second`,
        ]
        : []
    ),
    "",
    colorize.poison("Inferno Receives Bonuses From:"),
    "Warmth: +16% Fire Damage Per Level",
  ].join("|n");

const UnitEx = asyncRequire<
  typeof import("../../../units/UnitEx")
>("units.UnitEx");

export const infernoSkill = (unit: UnitExType | undefined): Skill => ({
  id: "inferno",
  type: "active",
  name: "Inferno",
  icon: "ReplaceableTextures/CommandButtons/BTNResurrection.blp",
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
    return this.level.base < 20 &&
      (this.unit ? this.unit.level >= this.level.base : false);
  },
  validate(playerId) {
    if (!state.heroes) return false;
    const hero = state.heroes[playerId];

    if (isInTown(hero)) return false;

    const mouse = mice[playerId];
    const target = mouse.targetLock ?? mouse.target ?? mouse;
    if (target === hero) return false;

    return hero.mana >= 4;
  },
  onUse(playerId, done) {
    if (!state.heroes) return done();
    const hero = state.heroes![playerId];

    hero.mana -= 4;

    const mouse = mice[playerId];
    const keyboard = { ...keyboards[playerId] };
    const target = mouse.targetLock ?? mouse.target ??
      mouse;
    let first = true;

    hero.unit.issueImmediateOrder("stop");
    hero.faceTarget(target);
    hero.setAnimation("spell");
    startTimeout(0.51, () => {
      if (hero.health === 0) return;

      const stop = startInterval(0.1, () => {
        if (hero.health === 0) {
          stop();
          return;
        }

        if (
          first ||
          (hero.mana >= manaCost(this.level.total) &&
            inputUnchanged(playerId, mouse, keyboard))
        ) {
          let castTarget = target;
          if (!first) {
            hero.mana -= manaCost(this.level.total) * 0.1;
            const mouse = mice[playerId];
            castTarget = mouse.targetLock ?? mouse.target ?? mouse;
          } else first = false;

          hero.faceTarget(castTarget);
          const { min, max } = getDamage(this.level.total, this);
          Projectile.spawnProjectile({
            angle: Vector2Ex.angleBetweenVectors(hero, castTarget),
            duration: getRange(this.level.total) / 8,
            model: "Abilities/Weapons/PhoenixMissile/Phoenix_Missile.mdl",
            owner: hero,
            radius: 128,
            speed: 512,
            x: hero.x,
            y: hero.y,
            damage: damageScale(randomDamage(min, max), 0.1),
          });
        } else {
          stop();
          // Takes another 490ms to finish backswing
          startTimeout(0.49, done);
        }
      });
    });
  },
});
