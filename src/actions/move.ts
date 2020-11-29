import { Hero } from "../Hero";
import { mice } from "../input/data";

interface MoveAction {
	type: "move";
	interruptable: true;
	perform: () => void;
}

export const moveAction = (hero: Hero): MoveAction => ({
	type: "move",
	interruptable: true,
	perform: () => {
		const playerId = hero.owner.id;
		hero.unit.issueOrderAt("move", mice[playerId].x, mice[playerId].y);
	},
});
