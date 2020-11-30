import {
	addScriptHook,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { UnitEx } from "../UnitEx";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	const t = new Trigger();
	t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
	t.addCondition(() => {
		const source = UnitEx.fromHandle(GetEventDamageSource());
		const target = UnitEx.fromHandle(BlzGetEventDamageTarget());
		source.damage(target, source.randomDamage());
		return false;
	});
});
