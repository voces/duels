import {
  addScriptHook,
  getElapsedTime,
  Group,
  Region,
  Timer,
  Trigger,
  W3TS_HOOK,
} from "@voces/w3ts";

import { isHeroType } from "../units/heroTypes";
import { UnitEx, UnitExProps } from "../units/UnitEx";
import { startTimeout } from "../util";

type InnerSpawnUnitProps = Omit<UnitExProps, "x" | "y" | "owner">;

type SpawnUnitProps = {
  [key in keyof Omit<UnitExProps, "x" | "y" | "owner">]:
    | UnitExProps[key]
    | (() => UnitExProps[key]);
};

export interface Spawn {
  x: number;
  y: number;
  initial: number;
  frequency: number;
  max: number;
  minDistance?: number;
  maxDistance?: number;
  unitData: SpawnUnitProps;
}

interface InternalSpawn extends Spawn {
  minDistance: number;
  distanceRange: number;
  units: Group;
  last: number;
}

const zones: Zone[] = [];

const unitSpawnMap = new Map<UnitEx, Group>();

export class Zone {
  players = 0;
  activated = false;
  spawns: InternalSpawn[];

  constructor(
    readonly name: string,
    readonly region: Region,
    spawns: Spawn[],
  ) {
    const last = getElapsedTime();
    this.spawns = spawns.map((spawn) => ({
      ...spawn,
      minDistance: spawn.minDistance ?? 0,
      distanceRange: Math.max(
        (spawn.maxDistance ?? 0) - (spawn.minDistance ?? 0),
        0,
      ),
      units: new Group(),
      last,
    }));

    const t = new Trigger();
    t.registerEnterRegion(
      region.handle,
      Filter(() => {
        const unit = UnitEx.fromFilter()!;
        if (unit.owner.id >= 16) return false;
        DisplayTextToPlayer(
          unit.owner.handle,
          0,
          0,
          `Entering ${this.name}`,
        );

        this.players++;
        if (this.players === 1 && !this.activated) this.activate();

        return false;
      }),
    );
    t.registerLeaveRegion(
      region.handle,
      Filter(() => {
        if (UnitEx.fromFilter()!.owner.id >= 16) return false;

        this.players--;

        return false;
      }),
    );

    zones.push(this);
  }

  spawnUnit(spawn: InternalSpawn, time = getElapsedTime()): void {
    const distance = Math.random() * spawn.distanceRange + spawn.minDistance;
    const angle = Math.random() * Math.PI * 2;
    const x = spawn.x + distance * Math.cos(angle);
    const y = spawn.y + distance * Math.sin(angle);

    const data = { ...spawn.unitData };
    let prop: keyof typeof data;
    for (prop in data) {
      const value = data[prop];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof value === "function") data[prop] = value() as any;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builtData: InnerSpawnUnitProps = data as any;

    const u = new UnitEx({
      // Ideally we'd use players 16-23 for this, but that wasn't working
      // If units stall out, may need to make teams with players 16-23
      // computers
      owner: PLAYER_NEUTRAL_AGGRESSIVE,
      x,
      y,
      ...builtData,
    });
    spawn.units.addUnit(u.unit);
    spawn.last = time;
    unitSpawnMap.set(u, spawn.units);
  }

  activate(time = getElapsedTime()): void {
    this.activated = true;
    for (const spawn of this.spawns) {
      for (let i = 0; i < spawn.initial; i++) this.spawnUnit(spawn, time);
    }
  }

  tick(time = getElapsedTime()): void {
    for (const spawn of this.spawns) {
      if (
        time - spawn.frequency >= spawn.last &&
        spawn.units.size < spawn.max
      ) {
        this.spawnUnit(spawn);
      }
    }
  }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  new Timer().start(1, true, () => {
    const time = getElapsedTime();
    for (const zone of zones) if (zone.activated) zone.tick(time);
  });

  const t = new Trigger();
  t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
  t.addCondition(() => {
    const u = UnitEx.fromEvent()!;
    const group = unitSpawnMap.get(u);
    if (!isHeroType(u) && group) {
      startTimeout(90, () => {
        u.unit.destroy();
        group.removeUnit(u.unit);
      });
    }
    return false;
  });
});
