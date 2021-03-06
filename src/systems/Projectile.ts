import {
	addScriptHook,
	Effect,
	getElapsedTime,
	Point,
	Timer,
	W3TS_HOOK,
} from "w3ts";

import { Damage } from "../damage";
import { UnitEx } from "../units/UnitEx";
import { dummyGroup } from "../util";

export interface Projectile {
	angle: number;
	damage: Damage;
	duration: number;
	maxTargets?: number;
	model: string;
	owner: UnitEx;
	radius: number;
	speed: number;
	x: number;
	y: number;
}

interface InnerProjectile extends Projectile {
	effect: Effect;
	spawnTime: number;
	maxTargets: number;
	height: number;
}

const projectiles = new Set<InnerProjectile>();

const point = new Point(0, 0);

export const spawnProjectile = (projectile: Projectile): void => {
	const effect = new Effect(projectile.model, projectile.x, projectile.y);
	point.setPosition(projectile.x, projectile.y);
	effect.z = point.z + 64;
	effect.setYaw(projectile.angle);

	const p: InnerProjectile = {
		...projectile,
		effect,
		maxTargets: projectile.maxTargets ?? 1,
		spawnTime: getElapsedTime(),
		speed: projectile.speed,
		height: point.z + 64,
	};

	projectiles.add(p);
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () =>
	new Timer().start(0.03, true, () => {
		const time = getElapsedTime();
		for (const projectile of projectiles.values()) {
			const delta = time - projectile.spawnTime;
			const x =
				projectile.x +
				delta * projectile.speed * Math.cos(projectile.angle);
			projectile.effect.x = x;
			const y =
				projectile.y +
				delta * projectile.speed * Math.sin(projectile.angle);
			projectile.effect.y = y;
			projectile.effect.z = projectile.height;

			dummyGroup.enumUnitsInRange(
				x,
				y,
				projectile.radius,
				Filter((): boolean => {
					if (projectile.maxTargets === 0) return false;

					const u = UnitEx.fromFilter()!;

					if (u.isAlly(projectile.owner.owner) || u.health <= 0)
						return false;
					projectile.maxTargets--;

					projectile.owner.damage(u, projectile.damage);

					return false;
				}),
			);
			dummyGroup.clear();

			if (projectile.maxTargets === 0 || delta > projectile.duration) {
				projectile.effect.destroy();
				projectiles.delete(projectile);
			}
		}
	}),
);
