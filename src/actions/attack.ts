import {
	addScriptHook,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { Hero } from "../Hero";
import { mice } from "../input/data";
import { UnitEx } from "../UnitEx";
import { startTimeout } from "../util";
import { Done, Perform } from "./queue";

interface AttackAction {
	type: "attack";
	target: UnitEx | null;
	interruptable: false;
	perform: Perform;
}

const doAttack = (hero: Hero, done: Done, target?: UnitEx | null) => {
	// Stop doing anything
	hero.unit.issueImmediateOrder("stop");

	// Face where we're attacking
	const pos = target ? target.unit : mice[hero.owner.id];
	const facing = Math.atan2(pos.y - hero.y, pos.x - hero.x);
	hero.facing = Rad2Deg(facing);

	// Play attack animation
	hero.setAnimation("attack");

	// Takes 510ms for damage to land
	startTimeout(0.51, () => {
		// Do damage
		if (target) hero.damage(target, hero.randomDamage());
		else hero.doMeleeAttack();

		// Takes another 490ms to finish backswing
		startTimeout(0.49, () => done());
	});
};

export const attackAction = (
	hero: Hero,
	target: UnitEx | null = null,
): AttackAction => ({
	type: "attack",
	target,
	interruptable: false,
	perform: (done) => {
		// If we have a target, either begin the attack if it's in range,
		// otherwise queue a move then attack
		if (target) {
			hero.unit.issueTargetOrder("attackonce", target.unit);
			done();
		}
		// If no target, just attack from where we are standing
		else doAttack(hero, done);
	},
});

const onAttackTrigger = new Trigger();

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	onAttackTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ATTACKED);
	// onAttackTrigger.addCondition(onMouseDown);
});
