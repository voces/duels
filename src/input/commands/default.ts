import { MapPlayer } from "w3ts";

import { attackAction } from "../../actions/attack";
import { moveAction } from "../../actions/move";
import { queueAction } from "../../actions/queue";
import { state } from "../../states/state";
import { mice } from "../data";
import { registerCommand } from "./registry";

registerCommand({
	name: "Attack in place",
	shortcuts: [{ mouse: "left", keyboard: "shift" }],
	priority: 3,
	damage: (playerId) => {
		if (state.state !== "grind") return;

		const hero = state.heroes[playerId];

		return hero.weapon;
	},
	fn: (playerId) => {
		if (state.state !== "grind") return false;

		const hero = state.heroes[playerId];

		queueAction(playerId, attackAction(hero));
		return true;
	},
});

registerCommand({
	name: "Attack",
	shortcuts: [{ mouse: "left" }],
	priority: 2,
	fn: (playerId) => {
		if (state.state !== "grind") return false;

		const mouse = mice[playerId];
		const target = mouse.targetLock;
		if (!target) return false;

		const hero = state.heroes[playerId];

		queueAction(playerId, attackAction(hero, target));
		return true;
	},
});

registerCommand({
	name: "Move",
	shortcuts: [{ mouse: "left" }],
	priority: 1,
	fn: (playerId) => {
		if (state.state !== "grind") return false;

		const hero = state.heroes[playerId];

		queueAction(playerId, moveAction(hero));
		return true;
	},
});
