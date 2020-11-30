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
	const rects = [
		gg_rct_bloodmore1,
		gg_rct_bloodmore2,
		gg_rct_bloodmore3,
	].map((h) => Rectangle.fromHandle(h));
	const xMin = Math.min(...rects.map((r) => r.minX));
	const xMax = Math.max(...rects.map((r) => r.maxX));
	const yMin = Math.min(...rects.map((r) => r.minY));
	const yMax = Math.min(...rects.map((r) => r.maxY));
	for (const rect of rects) region.addRect(rect);
	const xRange = xMax - xMin;
	const yRange = yMax - yMin;

	const randomSpawn = () => {
		let x = 0;
		let y = 0;
		while (!region.containsCoords(x, y)) {
			x = Math.random() * xRange + xMin;
			y = Math.random() * yRange + yMin;
		}
		return { x, y };
	};

	const max = GetRandomInt(1, 4);

	const zombieSpawns: Spawn[] = times(GetRandomInt(15, 25), () => ({
		unit: "n005",
		initial: GetRandomInt(1, Math.min(3, max)),
		frequency: GetRandomInt(30, 45),
		max,
		...randomSpawn(),
	}));

	new Zone(region, [...zombieSpawns]);
});
