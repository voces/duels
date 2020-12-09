import { mice } from "../../../input/data";
import { state } from "../../../states/state";
import { spawnProjectile } from "../../../systems/Projectile";
import { Vector2Ex } from "../../../util/Vector2";
import { Skill } from "../../types";

export const fireboltSkill = (): Skill => ({
	name: "Firebolt",
	level: 1,
	perform: (playerId) => {
		if (!("heroes" in state)) return false;
		const hero = state.heroes[playerId];
		spawnProjectile({
			angle: Vector2Ex.angleBetweenVectors(hero, mice[playerId]),
			damage: hero.randomDamage(),
			duration: 2.5,
			model: "Abilities/Weapons/FireBallMissile/FireBallMissile.mdl",
			owner: hero,
			radius: 96,
			speed: 700,
			x: hero.x,
			y: hero.y,
		});
		return true;
	},
});
