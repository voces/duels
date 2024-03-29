import { addScriptHook, Trigger, W3TS_HOOK } from "@voces/w3ts";

import { isDamageSystemOn } from "../damage";
import { UnitEx } from "../units/UnitEx";
import { asyncRequire } from "../util/asyncRequire";
import { Vector2Ex } from "../util/Vector2";

const Projectile = asyncRequire<
  typeof import("../systems/Projectile")
>("systems.Projectile");

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  const t = new Trigger();
  t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
  t.addCondition(() => {
    if (!isDamageSystemOn()) return false;

    const source = UnitEx.fromHandle(GetEventDamageSource()!);
    const target = UnitEx.fromHandle(BlzGetEventDamageTarget()!);

    const range = BlzGetUnitWeaponRealField(
      source.unit.handle,
      UNIT_WEAPON_RF_ATTACK_RANGE,
      0,
    );

    // TODO: simulate defense
    if (range < 128) source.damage(target, source.randomDamage());

    return false;
  });

  const t2 = new Trigger();
  t2.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ATTACKED);
  t2.addCondition(() => {
    const source = UnitEx.fromHandle(GetAttacker()!);
    const target = UnitEx.fromEvent();

    const range = BlzGetUnitWeaponRealField(
      source.unit.handle,
      UNIT_WEAPON_RF_ATTACK_RANGE,
      0,
    );

    if (range >= 128 && target && source.owner.id >= 16) {
      const angle = Vector2Ex.angleBetweenVectors(source, target);

      Projectile.spawnProjectile({
        angle,
        damage: source.randomDamage(),
        duration: 2.5,
        model: source.weapon.projectile ??
          "Abilities/Weapons/BristleBackMissile/BristleBackMissile.mdl",
        owner: source,
        radius: 96,
        speed: source.weapon.projectileSpeed ?? 700,
        x: source.x,
        y: source.y,
      });
    }

    return false;
  });
});
