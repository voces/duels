import { randomDamage } from "../../../damage";
import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { spawnProjectile } from "../../../systems/Projectile";
import { startTimeout } from "../../../util";
import { Vector2Ex } from "../../../util/Vector2";
import { Skill } from "../../types";

export const fireboltSkill = (): Skill => ({
	name: "Firebolt",
	level: 1,
	damage: {
		min: { fire: 3 },
		max: { fire: 5 },
	},
	validate: (playerId) => {
		if (!("heroes" in state)) return false;
		const hero = state.heroes[playerId];
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
