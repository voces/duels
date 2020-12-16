import { isInTown } from "../../../areas/town2";
import { randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { spawnProjectile as spawnProjectileType } from "../../../systems/Projectile";
import { startTimeout } from "../../../util";
import { Vector2Ex } from "../../../util/Vector2";
import { Skill } from "../../types";

let spawnProjectile: typeof spawnProjectileType;

export const fireboltSkill = (): Skill => ({
	name: "Firebolt",
	level: 0,
	damage: {
		min: { fire: 0 },
		max: { fire: 0 },
	},
	setLevel(newLevel: number) {
		this.level = newLevel;
		this.damage!.min.fire = Math.round(
			1.735 +
				1.342 * this.level -
				0.006 * this.level ** 2 +
				0.002 * this.level ** 3,
		);
		this.damage!.max.fire = Math.round(
			-0.002 * this.level ** 3 +
				0.153 * this.level ** 2 +
				0.174 * this.level +
				6.506,
		);
	},
	validate: (playerId) => {
		if (!("heroes" in state)) return false;
		const hero = state.heroes[playerId];

		if (isInTown(hero)) return false;

		const mouse = mice[playerId];
		const target = mouse.targetLock ?? mouse.target ?? mouse;
		if (target === hero) return false;

		return hero.mana >= 3;
	},
	perform(playerId, done) {
		if (!("heroes" in state)) return done();
		const hero = state.heroes[playerId];

		hero.mana -= 3;

		const mouse = mice[playerId];
		const target = mouse.targetLock ?? mouse.target ?? mouse;

		hero.unit.issueImmediateOrder("stop");
		hero.faceTarget(target);
		hero.setAnimation("spell");

		if (!spawnProjectile)
			spawnProjectile = require("src.systems.Projectile").spawnProjectile;

		startTimeout(0.51, () => {
			spawnProjectile({
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
