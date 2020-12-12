import {
	addScriptHook,
	MapPlayer,
	Timer,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { UnitEx } from "../units/UnitEx";
import { forEachHero, forEachPlayer } from "../util";
import { processShortcut } from "./commands/registry";
import { KeyboardShortcut, MouseShortcut } from "./commands/types";
import { keyboards, mice, NONE, updateMouse } from "./data";

const osKeyToStringMap = (key: oskeytype) => {
	switch (key) {
		case OSKEY_A:
			return "a";
		case OSKEY_B:
			return "b";
		case OSKEY_C:
			return "c";
		case OSKEY_D:
			return "d";
		case OSKEY_E:
			return "e";
		case OSKEY_F:
			return "f";
		case OSKEY_G:
			return "g";
		case OSKEY_H:
			return "h";
		case OSKEY_I:
			return "i";
		case OSKEY_J:
			return "j";
		case OSKEY_K:
			return "k";
		case OSKEY_L:
			return "l";
		case OSKEY_M:
			return "m";
		case OSKEY_N:
			return "n";
		case OSKEY_O:
			return "o";
		case OSKEY_P:
			return "p";
		case OSKEY_Q:
			return "q";
		case OSKEY_R:
			return "r";
		case OSKEY_S:
			return "s";
		case OSKEY_T:
			return "t";
		case OSKEY_U:
			return "u";
		case OSKEY_V:
			return "v";
		case OSKEY_W:
			return "w";
		case OSKEY_X:
			return "x";
		case OSKEY_Y:
			return "y";
		case OSKEY_Z:
			return "z";
		case OSKEY_LSHIFT:
			return "shift";
	}
};
const executeCommands = (playerId: number) => {
	const playerMouse = mice[playerId];
	const playerKeyborad = keyboards[playerId];

	const mouse: MouseShortcut[] = [];
	if (playerMouse.leftDown) mouse.push("left");
	if (playerMouse.rightDown) mouse.push("right");

	const keyboard = Object.entries(playerKeyborad)
		.filter(([, value]) => value)
		.map(([key]) => key) as KeyboardShortcut[];

	const shortcut = { mouse, keyboard };

	processShortcut(playerId, shortcut);
};

const mouseDownTrigger = new Trigger();
const onMouseDown = () => {
	const player = MapPlayer.fromEvent();

	// We must get this before calling EnableUserControl
	const targetHandle = BlzGetMouseFocusUnit();

	// Enables keyboard listeners while the mouse is down
	if (GetLocalPlayer() === player.handle) EnableUserControl(true);

	const playerId = player.id;
	const button = BlzGetTriggerPlayerMouseButton();
	const target = UnitEx.fromHandle(targetHandle);

	updateMouse(playerId, {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT ? true : mice[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? true
				: mice[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		targetLock: target ?? NONE,
		target: target ?? NONE,
		moved: false,
	});

	executeCommands(playerId);

	return false;
};

const mouseUpTrigger = new Trigger();
const onMouseUp = () => {
	const playerId = MapPlayer.fromEvent().id;
	const button = BlzGetTriggerPlayerMouseButton();

	updateMouse(playerId, {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT ? false : mice[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? false
				: mice[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		targetLock: NONE,
		target: UnitEx.fromHandle(BlzGetMouseFocusUnit()) ?? NONE,
		moved: false,
	});

	return false;
};

const mouseMoveTrigger = new Trigger();
const onMouseMove = () => {
	const playerId = MapPlayer.fromEvent().id;

	updateMouse(playerId, {
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		target: UnitEx.fromHandle(BlzGetMouseFocusUnit()) ?? NONE,
		moved: true,
	});

	return false;
};

const keyDownTrigger = new Trigger();
const onKeyDown = () => {
	const playerId = MapPlayer.fromEvent().id;
	const key = osKeyToStringMap(BlzGetTriggerPlayerKey());
	if (key) keyboards[playerId][key] = true;
	executeCommands(playerId);
	return false;
};

const keyUpTrigger = new Trigger();
const onKeyUp = () => {
	const playerId = MapPlayer.fromEvent().id;
	const key = osKeyToStringMap(BlzGetTriggerPlayerKey());
	if (key) keyboards[playerId][key] = false;
	return false;
};

const ticker = new Timer();
const tick = () => {
	forEachHero((hero) => {
		const pid = hero.owner.id;
		const mouse = mice[pid];
		if ((mouse.leftDown || mouse.rightDown) && mouse.moved) {
			executeCommands(pid);
			updateMouse(pid, { moved: false });
		}
	});
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	forEachPlayer((player) => {
		mouseDownTrigger.registerPlayerMouseEvent(
			player,
			bj_MOUSEEVENTTYPE_DOWN,
		);
		mouseUpTrigger.registerPlayerMouseEvent(player, bj_MOUSEEVENTTYPE_UP);
		mouseMoveTrigger.registerPlayerMouseEvent(
			player,
			bj_MOUSEEVENTTYPE_MOVE,
		);
		keyDownTrigger.registerPlayerKeyEvent(player, OSKEY_LSHIFT, 1, true);
		keyUpTrigger.registerPlayerKeyEvent(player, OSKEY_LSHIFT, 0, false);
		[
			OSKEY_A,
			OSKEY_B,
			OSKEY_C,
			OSKEY_D,
			OSKEY_E,
			OSKEY_F,
			OSKEY_G,
			OSKEY_H,
			OSKEY_I,
			OSKEY_J,
			OSKEY_K,
			OSKEY_L,
			OSKEY_M,
			OSKEY_N,
			OSKEY_O,
			OSKEY_P,
			OSKEY_Q,
			OSKEY_R,
			OSKEY_S,
			OSKEY_T,
			OSKEY_U,
			OSKEY_V,
			OSKEY_W,
			OSKEY_X,
			OSKEY_Y,
			OSKEY_Z,
		].forEach((key) => {
			keyDownTrigger.registerPlayerKeyEvent(player, key, 0, true);
			keyUpTrigger.registerPlayerKeyEvent(player, key, 0, false);
		});
	});

	mouseDownTrigger.addCondition(onMouseDown);
	mouseUpTrigger.addCondition(onMouseUp);
	mouseMoveTrigger.addCondition(onMouseMove);
	keyDownTrigger.addCondition(onKeyDown);
	keyUpTrigger.addCondition(onKeyUp);

	ticker.start(0.25, true, tick);
});
