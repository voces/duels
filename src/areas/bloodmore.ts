import { addScriptHook, Rectangle, Region, W3TS_HOOK } from "@voces/w3ts";

import { times } from "../util";
import { WeatherEffect } from "./weather";
import { Spawn, Zone } from "./Zone";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  const region = new Region();
  const rects = [gg_rct_bloodmore1, gg_rct_bloodmore2, gg_rct_bloodmore3].map(
    (h) => {
      EnableWeatherEffect(
        AddWeatherEffect(h, WeatherEffect.ashenvaleHeavyRain)!,
        true,
      );

      return Rectangle.fromHandle(h)!;
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
      resistances: { holy: 0 },
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

  const gnollCampSpawns: Spawn[] = times(GetRandomInt(5, 10), () => {
    const maxGnoll = GetRandomInt(5, 12);
    const maxGnollDistance = GetRandomReal(512, 1024);
    const maxGnollShaman = GetRandomInt(1, 3);
    const maxGnollShamanDistance = GetRandomReal(256, 512);
    return [
      {
        initial: GetRandomInt(1, maxGnoll),
        frequency: GetRandomInt(15, 40),
        max: maxGnoll,
        maxDistance: maxGnollDistance,
        minDistance: GetRandomReal(256, maxGnollDistance),
        ...randomSpawn(),
        unitData: {
          unit: "n007", // Gnoll
          level: 1,
          maxHealth: () => GetRandomInt(1, 4),
          weapon: { min: { physical: 1 }, max: { physical: 2 } },
          resistances: { holy: 0.5 },
        },
      },
      {
        initial: GetRandomInt(1, maxGnollShaman),
        frequency: GetRandomInt(30, 60),
        max: maxGnollShaman,
        maxDistance: maxGnollShamanDistance,
        minDistance: GetRandomReal(256, maxGnollShamanDistance),
        ...randomSpawn(),
        unitData: {
          unit: "n008", // Kobold Geomancer
          level: 2,
          maxHealth: () => GetRandomInt(5, 9),
          weapon: {
            min: { fire: 1 },
            max: { fire: 3 },
            projectile: "Abilities/Weapons/FireBallMissile/FireBallMissile.mdl",
          },
          resistances: { holy: 0.25 },
        },
      },
    ];
  }).flat();

  new Zone("Blood Moor", region, [
    ...zombieSpawns,
    ...quilbeastSpawns,
    ...gnollCampSpawns,
  ]);
});
