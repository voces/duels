import {
	addScriptHook,
	Rectangle,
	Region,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { times } from "../util";
import { Spawn, Zone } from "./Zone";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	const region = new Region();
	region.addRect(Rectangle.fromHandle(gg_rct_bloodmore1));
	region.addRect(Rectangle.fromHandle(gg_rct_bloodmore2));
	region.addRect(Rectangle.fromHandle(gg_rct_bloodmore3));

	const zombieSpawns: Spawn[] = times(Math.random() * 5, () => ({
		x: 0,
		y: 0,
		unit: "hfoo",
		initial: Math.random() * 2 + 1,
		frequency: Math.random() * 15 + 30,
		max: Math.random() * 2 + 2,
	}));

	new Zone(region, [...zombieSpawns]);
});
