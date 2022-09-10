import {
  addScriptHook,
  Group,
  Rectangle,
  Region,
  Trigger,
  Unit,
  W3TS_HOOK,
} from "@voces/w3ts";

import { UnitEx } from "../units/UnitEx";
import { dummyGroup } from "../util";
import { colorize } from "../util/colorize";
import { setTown } from "./town2";
import { WeatherEffect } from "./weather";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  try {
    EnableWeatherEffect(
      AddWeatherEffect(gg_rct_camp, WeatherEffect.ashenvaleLightRain),
      true,
    );

    const region = new Region();
    setTown(region);
    const trigger = new Trigger();
    const rect = Rectangle.fromHandle(gg_rct_camp);
    region.addRect(rect);

    dummyGroup.enumUnitsInRect(
      Rectangle.fromHandle(gg_rct_camp),
      Filter(() => {
        Unit.fromFilter().invulnerable = true;
        return false;
      }),
    );

    trigger.registerEnterRegion(
      region.handle,
      Filter(() => {
        const unit = UnitEx.fromFilter()!;

        UnitEx.fromFilter()!.unit.invulnerable = true;

        if (unit.owner.id < 16 && unit.unit.typeId !== FourCC("e000")) {
          DisplayTextToPlayer(
            unit.owner.handle,
            0,
            0,
            "Entering Town",
          );
        }

        return false;
      }),
    );
    trigger.registerLeaveRegion(
      region.handle,
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
    console.error(colorize.error(err));
  }
});
