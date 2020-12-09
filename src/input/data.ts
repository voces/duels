import { UnitEx } from "../UnitEx";
import { times } from "../util";

interface Mouse {
	/**
	 * Whether the left mouse button is currently pressed.
	 */
	leftDown: boolean;
	/**
	 * Whether the right mouse button is currently pressed.
	 */
	rightDown: boolean;
	/**
	 * The current x coordinate of the cursor in world coordinates.
	 */
	x: number;
	/**
	 * The current y coordinate of the cursor in world coordinates.
	 */
	y: number;
	/**
	 * The target unit when either mouse button was pressed.
	 */
	targetLock: UnitEx | null;
	/**
	 * The current target unit under the cursor.
	 */
	target: UnitEx | null;
	moved: boolean;
}

interface Keyboard {
	shift: boolean;
	a: boolean;
	b: boolean;
	c: boolean;
	d: boolean;
	e: boolean;
	f: boolean;
	g: boolean;
	h: boolean;
	i: boolean;
	j: boolean;
	k: boolean;
	l: boolean;
	m: boolean;
	n: boolean;
	o: boolean;
	p: boolean;
	q: boolean;
	r: boolean;
	s: boolean;
	t: boolean;
	u: boolean;
	v: boolean;
	w: boolean;
	x: boolean;
	y: boolean;
	z: boolean;
}

export const mice: Mouse[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	leftDown: false,
	rightDown: false,
	x: 0,
	y: 0,
	targetLock: null,
	target: null,
	moved: false,
}));

export const keyboards: Keyboard[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	shift: false,
	a: false,
	b: false,
	c: false,
	d: false,
	e: false,
	f: false,
	g: false,
	h: false,
	i: false,
	j: false,
	k: false,
	l: false,
	m: false,
	n: false,
	o: false,
	p: false,
	q: false,
	r: false,
	s: false,
	t: false,
	u: false,
	v: false,
	w: false,
	x: false,
	y: false,
	z: false,
}));
