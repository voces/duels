import { addScriptHook, Rectangle, Region, W3TS_HOOK } from "w3ts";

import { times } from "../util";
import { WeatherEffect } from "./weather";
import { Spawn, Zone } from "./Zone";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	const region = new Region();
	const rects = [gg_rct_bloodmore1, gg_rct_bloodmore2, gg_rct_bloodmore3].map(
		(h) => {
			EnableWeatherEffect(
				AddWeatherEffect(h, WeatherEffect.ashenvaleHeavyRain),
				true,
			);

			return Rectangle.fromHandle(h);
		},
	);

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

	const maxZombies = GetRandomInt(1, 4);
	const maxZombieDistance = GetRandomReal(128, 768);
	const zombieSpawns: Spawn[] = times(GetRandomInt(15, 25), () => ({
		initial: GetRandomInt(1, maxZombies),
		frequency: GetRandomInt(30, 45),
		max: maxZombies,
		maxDistance: maxZombieDistance,
		minDistance: GetRandomReal(128, maxZombieDistance),
		...randomSpawn(),
		unitData: {
			unit: "n005",
			level: 1,
			maxHealth: () => GetRandomInt(7, 12),
			weapon: { min: { physical: 1 }, max: { physical: 3 } },
		},
	}));

	const maxQuilbeasts = GetRandomInt(1, 2);
	const maxQuilbeastDistance = GetRandomReal(256, 768);
	const quilbeastSpawns: Spawn[] = times(GetRandomInt(20, 35), () => ({
		initial: GetRandomInt(1, maxQuilbeasts),
		frequency: GetRandomInt(20, 45),
		max: maxQuilbeasts,
		maxDistance: maxQuilbeastDistance,
		minDistance: GetRandomReal(256, maxQuilbeastDistance),
		...randomSpawn(),
		unitData: {
			unit: "n006",
			level: 1,
			maxHealth: () => GetRandomInt(1, 5),
			weapon: { min: { physical: 0.5 }, max: { physical: 1.5 } },
		},
	}));

	new Zone(region, [...zombieSpawns, ...quilbeastSpawns]);
});
