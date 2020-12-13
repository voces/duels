import {
	addScriptHook,
	Group,
	Rectangle,
	Region,
	Trigger,
	Unit,
	W3TS_HOOK,
} from "w3ts";

import { UnitEx } from "../units/UnitEx";
import { colorize } from "../util/colorize";
import { WeatherEffect } from "./weather";

let town: Region;

export const isInTown = (unit: UnitEx): boolean => town.containsUnit(unit.unit);

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	try {
		EnableWeatherEffect(
			AddWeatherEffect(gg_rct_camp, WeatherEffect.ashenvaleLightRain),
			true,
		);

		town = new Region();
		const trigger = new Trigger();
		const rect = Rectangle.fromHandle(gg_rct_camp);
		town.addRect(rect);

		trigger.registerEnterRegion(
			town.handle,
			Filter(() => {
				const unit = UnitEx.fromFilter()!;

				UnitEx.fromFilter()!.unit.invulnerable = true;

				if (unit.owner.id < 16 && unit.unit.typeId !== FourCC("e000"))
					DisplayTextToPlayer(
						unit.owner.handle,
						0,
						0,
						"Entering Town",
					);

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
