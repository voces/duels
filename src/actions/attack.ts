import { Hero } from "../Hero";
import { mice } from "../input/data";
import { UnitEx } from "../UnitEx";
import { log, timeout } from "../util";

interface AttackAction {
	type: "attack";
	target: UnitEx | null;
	interruptable: false;
	perform: (done: () => void) => void;
}

export const attackAction = (
	hero: Hero,
	target: UnitEx | null = null,
): AttackAction => ({
	type: "attack",
	target,
	interruptable: false,
	perform: (done) => {
		// If we have an actual target, just attack it
		// This gives us the move-to-target-and-hit sequence for free
		if (target) hero.unit.issueTargetOrder("attackonce", target.unit);
		// If no target, just attack from where we are standing
		else {
			hero.unit.issueImmediateOrder("stop");

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
