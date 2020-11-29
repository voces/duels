import { Unit } from "../../node_modules/w3ts/index";
import { mice } from "../input/data";

interface MoveAction {
	type: "move";
	interruptable: true;
	perform: () => void;
}

export const moveAction = (hero: Unit): MoveAction => ({
	type: "move",
	interruptable: true,
	perform: () => {
		const playerId = hero.owner.id;
		hero.issueOrderAt("move", mice[playerId].x, mice[playerId].y);
	},
});
