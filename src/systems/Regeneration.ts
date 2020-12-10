import {
	addScriptHook,
	getElapsedTime,
	Timer,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { forEachHero } from "../util";

let last = 0;
addScriptHook(W3TS_HOOK.MAIN_AFTER, () =>
	new Timer().start(0.1, true, () => {
		const time = getElapsedTime();
		const delta = time - last;
		forEachHero((hero) => {
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
	}),
);
