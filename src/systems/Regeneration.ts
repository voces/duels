import { addScriptHook, getElapsedTime, Timer, W3TS_HOOK } from "@voces/w3ts";

import { forEachHero } from "../util";

let last = 0;
addScriptHook(W3TS_HOOK.MAIN_AFTER, () =>
  new Timer().start(0.1, true, () => {
    const time = getElapsedTime();
    const delta = time - last;
    forEachHero((hero) => {
      if (hero.health <= 0) return;
      hero.health = Math.min(
        hero.health + hero.healthRegen * delta,
        hero.maxHealth,
      );
      hero.mana = Math.min(
        hero.mana + hero.manaRegen * delta,
        hero.maxMana,
      );
    });
    last = time;
  }));
