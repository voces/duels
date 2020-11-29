import "./magic";
import "./ui/setup";
import "./states/heroSelection";
import "./input/input";
import "./areas/index";

import {
	addScriptHook,
	MapPlayer,
	W3TS_HOOK,
} from "../node_modules/w3ts/index";
import { forEachPlayer } from "./util";

const isHuman = (player: MapPlayer) => player.id < 16;
const isNPC = (player: MapPlayer) => player.id === PLAYER_NEUTRAL_PASSIVE;
const isHostile = (player: MapPlayer) => !isHuman(player) && !isNPC(player);

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	forEachPlayer(
		(player1) => {
			forEachPlayer((player2) => {
				if (player1 === player2) return;

				let passive: boolean;

				// Non-hostiles start out passive with eachother
				if (!isHostile(player1)) passive = !isHostile(player2);
				// Hostiles start out passive with each other
				else passive = isHostile(player2);

				player1.setAlliance(player2, ALLIANCE_PASSIVE, passive);
			});
		},
		() => true,
	);
});
