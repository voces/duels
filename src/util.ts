import { Group, MapPlayer, Timer } from "../node_modules/w3ts/index";
import { Hero } from "./Hero";
import { state } from "./states/state";

export const iflt = (fn: () => void): void => {
	if (GetTriggerPlayer() === GetLocalPlayer()) fn();
};

export const ifltw = (fn: () => void): (() => void) => () => iflt(fn);

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
		)
			continue;
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

export { log } from "../node_modules/w3ts-jsx/dist/node_modules/basic-pragma/src/utils/log";
export { colorize } from "../node_modules/w3ts-jsx/dist/node_modules/basic-pragma/src/utils/colorize";

const timerPool: Timer[] = [];

export const timeout = (seconds: number, fn: () => void): void => {
	const timer = timerPool[0] ?? new Timer();
	timer.start(seconds, false, () => {
		timerPool.push(timer);
		fn();
	});
};

export const dummyGroup = new Group();
