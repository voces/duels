import {
	addScriptHook,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { Hero } from "../Hero";
import { mice } from "../input/data";
import { UnitEx } from "../UnitEx";
import { timeout } from "../util";

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
				hero.doMeleeArea();
				timeout(0.49, () => done());
			});
		}
	},
});

const onAttackTrigger = new Trigger();

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	onAttackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ATTACKED);
	// onAttackTrigger.addCondition(onMouseDown);
});
