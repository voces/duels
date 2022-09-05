import { Group, MapPlayer, Timer } from "@voces/w3ts";

import { state } from "./states/state";
import { Hero } from "./units/Hero";

export const times = <T>(count: number, fn: (i: number) => T): T[] => {
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(fn(i));
  return arr;
};

const isPlayingHuman = (player: MapPlayer) =>
  player.controller === MAP_CONTROL_USER &&
  player.slotState === PLAYER_SLOT_STATE_PLAYING;

export const forEachPlayer = (
  fn: (player: MapPlayer) => void,
  filter: (player: MapPlayer) => boolean = isPlayingHuman,
): void => {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    const player = MapPlayer.fromHandle(Player(i));
    if (filter(player)) fn(player);
  }
};

export const everyPlayer = (fn: (player: MapPlayer) => boolean): boolean => {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    const player = MapPlayer.fromHandle(Player(i));
    if (
      player.controller !== MAP_CONTROL_USER ||
      player.slotState !== PLAYER_SLOT_STATE_PLAYING
    ) {
      continue;
    }
    if (!fn(player)) return false;
  }
  return true;
};

export const forEachHero = (fn: (hero: Hero) => void): void => {
  if (state.state !== "grind") return;
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    const hero = state.heroes[i];
    if (hero == null) continue;
    fn(hero);
  }
};

const timerPool: Timer[] = [];

export const startTimeout = (seconds: number, fn: () => void): () => void => {
  const timer = timerPool.pop() ?? new Timer();
  timer.start(seconds, false, () => {
    timerPool.push(timer);
    fn();
  });

  let canceled = false;
  return () => {
    if (canceled) return;
    canceled = true;
    timer.pause();
    timerPool.push(timer);
  };
};

export const startInterval = (
  seconds: number,
  fn: () => void,
): () => void => {
  const timer = timerPool.pop() ?? new Timer();
  timer.start(seconds, true, () => fn());

  let canceled = false;
  return () => {
    if (canceled) return;
    canceled = true;
    timer.pause();
    timerPool.push(timer);
  };
};

export const dummyGroup = new Group();
