import { Unit } from "../../node_modules/w3ts/index";
import { mice } from "../input/data";
import { log, timeout } from "../util";

interface AttackAction {
	type: "attack";
	target: Unit | null;
	interruptable: false;
	perform: (done: () => void) => void;
}

export const attackAction = (
	hero: Unit,
	target: Unit | null = null,
): AttackAction => ({
	type: "attack",
	target,
	interruptable: false,
	perform: (done) => {
		// If we have an actual target, just attack it
		// This gives us the move-to-target-and-hit sequence for free
		if (target) hero.issueTargetOrder("attackonce", target);
		// If no target, just attack from where we are standing
		else {
			hero.issueImmediateOrder("stop");

			const mouse = mice[hero.owner.id];
			const facing = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
			hero.facing = Rad2Deg(facing);

			hero.setAnimation("attack");

			timeout(0.51, () => {
				log("damage");
				timeout(0.49, () => done());
			});
		}
	},
});
