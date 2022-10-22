import { isInTown } from "../../../areas/town2";
import { damageRangeToString, randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { startTimeout } from "../../../util";
import { asyncRequire } from "../../../util/asyncRequire";
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
    `Mana Cost: ${3}`,
    `Fire Damage: ${damageRangeToString(skill?.damage, false)}`,
  ].join("|n");

export const fireboltSkill = (): Skill => ({
  id: "firebolt",
  name: "Fire Bolt",
  description: getDescription(undefined),
  icon: "ReplaceableTextures/CommandButtons/BTNFireBolt.blp",
  level: 0,
  damage: {
    min: { fire: 0 },
    max: { fire: 0 },
  },
  setLevel(newLevel: number) {
    this.level = newLevel;
    this.damage!.min.fire = Math.round(
      3.78 +
        0.469 * this.level -
        0.0777 * this.level ** 2,
    );
    this.damage!.max.fire = Math.round(
      4.96 +
        0.834 * this.level +
        0.0898 * this.level ** 2,
    );
    this.description = getDescription(this);
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
