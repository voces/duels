import {
	addScriptHook,
	Rectangle,
	Region,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { UnitEx } from "../UnitEx";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	const trigger = new Trigger();
	const region = new Region();
	region.addRect(Rectangle.fromHandle(gg_rct_camp));
	trigger.registerEnterRegion(
		region.handle,
		Filter(() => {
			UnitEx.fromFilter()!.unit.addAbility(FourCC("Avul"));
			return false;
		}),
	);
	trigger.registerLeaveRegion(
		region.handle,
		Filter(() => {
			UnitEx.fromFilter()!.unit.removeAbility(FourCC("Avul"));
			return false;
		}),
	);
});
