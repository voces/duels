import { times } from "../util";

interface Mouse {
	leftDown: boolean;
	rightDown: boolean;
	x: number;
	y: number;
}

interface Keyboard {
	shiftDown: boolean;
}

export const mice: Mouse[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	leftDown: false,
	rightDown: false,
	x: 0,
	y: 0,
}));

export const keyboards: Keyboard[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	shiftDown: false,
}));
