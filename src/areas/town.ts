import {
	addScriptHook,
	Group,
	Rectangle,
	Region,
	Trigger,
	Unit,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { UnitEx } from "../units/UnitEx";
import { colorize } from "../util/colorize";
import { WeatherEffect } from "./weather";

const town = new Region();

export const isInTown = (unit: UnitEx): boolean => town.containsUnit(unit.unit);

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	try {
		EnableWeatherEffect(
			AddWeatherEffect(gg_rct_camp, WeatherEffect.ashenvaleLightRain),
			true,
		);

		const trigger = new Trigger();
		const rect = Rectangle.fromHandle(gg_rct_camp);
		town.addRect(rect);

		trigger.registerEnterRegion(
			town.handle,
			Filter(() => {
				UnitEx.fromFilter()!.unit.invulnerable = true;
				return false;
			}),
		);
		trigger.registerLeaveRegion(
			town.handle,
			Filter(() => {
				UnitEx.fromFilter()!.unit.invulnerable = false;
				return false;
			}),
		);
		const g = new Group();
		g.enumUnitsInRect(
			rect,
			Filter(() => {
				const unit = Unit.fromHandle(GetEnumUnit());
				unit.invulnerable = true;
				unit.acquireRange = 0;
				new UnitEx({ unit });
				return false;
			}),
		);
	} catch (err) {
		print(colorize.error(err));
	}
});
