import "./magic";
import "./ui/setup";
import "./states/heroSelection";
import "./input/input";
import "./areas/index";
import "./hostiles/damage";

import {
	addScriptHook,
	MapPlayer,
	W3TS_HOOK,
} from "../node_modules/w3ts/index";

const isHuman = (player: MapPlayer) => player.id < 16;
const isNPC = (player: MapPlayer) => player.id === PLAYER_NEUTRAL_PASSIVE;
const isHostile = (player: MapPlayer) => !isHuman(player) && !isNPC(player);

// addScriptHook(W3TS_HOOK.CONFIG_AFTER, () => {
// 	for (let i = 0; i < 16; i++) SetPlayerRaceSelectable(Player(i), false);
// });

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	for (let i = 0; i < bj_MAX_PLAYERS + 4; i++)
		for (let n = 0; n < bj_MAX_PLAYERS + 4; n++) {
			if (i === n) continue;
			const player1 = MapPlayer.fromIndex(i);
			const player2 = MapPlayer.fromIndex(n);
			let passive: boolean;
			// Non-hostiles start out passive with eachother
			if (!isHostile(player1)) passive = !isHostile(player2);
			// Hostiles start out passive with each other
			else passive = isHostile(player2);
			player1.setAlliance(player2, ALLIANCE_PASSIVE, passive);
		}
});
