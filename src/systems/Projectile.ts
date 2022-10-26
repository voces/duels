import {
  addScriptHook,
  Effect,
  getElapsedTime,
  Point,
  Timer,
  W3TS_HOOK,
} from "@voces/w3ts";

import type { Damage } from "../damage";
import type { UnitEx as UnitExType } from "../units/UnitEx";
import { dummyGroup } from "../util";
import { asyncRequire } from "../util/asyncRequire";

export interface Projectile {
  angle: number;
  duration: number;
  model: string;
  owner: UnitExType;
  radius: number;
  speed: number;
  x: number;
  y: number;
  damage?: Damage;
  onHit?: (unit: UnitExType, projectile: InnerProjectile) => void;
}

interface InnerProjectile extends Projectile {
  effect: Effect;
  spawnTime: number;
  height: number;
}

const projectiles = new Set<InnerProjectile>();

const point = new Point(0, 0);

const UnitEx = asyncRequire<
  typeof import("../units/UnitEx")
>("units.UnitEx");

export const spawnProjectile = (projectile: Projectile): void => {
  const effect = new Effect(projectile.model, projectile.x, projectile.y);
  point.setPosition(projectile.x, projectile.y);
  effect.z = point.z + 64;
  effect.setYaw(projectile.angle);

  const p: InnerProjectile = {
    ...projectile,
    effect,
    spawnTime: getElapsedTime(),
    speed: projectile.speed,
    height: point.z + 64,
  };

  projectiles.add(p);
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  new Timer().start(0.03, true, () => {
    const time = getElapsedTime();
    for (const projectile of projectiles.values()) {
      const delta = time - projectile.spawnTime;
      const x = projectile.x +
        delta * projectile.speed * Math.cos(projectile.angle);
      projectile.effect.x = x;
      const y = projectile.y +
        delta * projectile.speed * Math.sin(projectile.angle);
      projectile.effect.y = y;
      projectile.effect.z = projectile.height;

      let hit: UnitExType | undefined;
      dummyGroup.enumUnitsInRange(
        x,
        y,
        projectile.radius,
        (): boolean => {
          if (hit) return false;

          const u = UnitEx.UnitEx.fromFilter()!;
          if (u.isAlly(projectile.owner.owner) || u.health <= 0) return false;

          hit = u;

          return false;
        },
      );

      if (hit) {
        if (projectile.damage) projectile.owner.damage(hit, projectile.damage);
        if (projectile.onHit) {
          projectile.x = x;
          projectile.y = y;
          projectile.onHit(hit, projectile);
        }
      }

      if (hit || delta > projectile.duration) {
        projectile.effect.destroy();
        projectiles.delete(projectile);
      }
    }
  });
});
