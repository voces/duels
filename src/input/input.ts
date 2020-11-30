import {
	addScriptHook,
	MapPlayer,
	Timer,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { attackAction } from "../actions/attack";
import { moveAction } from "../actions/move";
import { queueAction } from "../actions/queue";
import { state } from "../states/state";
import { UnitEx } from "../UnitEx";
import { forEachHero, forEachPlayer } from "../util";
import { keyboards, mice } from "./data";

const queueMove = (playerId: number) => {
	if (state.state !== "grind") return;

	const hero = state.heroes[playerId];
	queueAction(playerId, moveAction(hero));
};

const queueLeftAction = (playerId: number, target?: UnitEx) => {
	if (state.state !== "grind") return;

	const hero = state.heroes[playerId];

	// Only attack enemies!
	if (target && hero.unit.isAlly(target.unit.owner))
		return queueMove(playerId);

	queueAction(playerId, attackAction(hero, target));
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

	mice[playerId] = {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT ? true : mice[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? true
				: mice[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		targetLock: target,
	};

	if (button === MOUSE_BUTTON_TYPE_LEFT)
		if (target) queueLeftAction(playerId, target);
		else if (keyboards[playerId].shiftDown) queueLeftAction(playerId);
		else queueMove(playerId);

	return false;
};

const mouseUpTrigger = new Trigger();
const onMouseUp = () => {
	const playerId = MapPlayer.fromEvent().id;
	const button = BlzGetTriggerPlayerMouseButton();
	mice[playerId] = mice[playerId] = {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT ? false : mice[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? false
				: mice[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		targetLock: null,
	};
	return false;
};

const mouseMoveTrigger = new Trigger();
const onMouseMove = () => {
	const playerId = MapPlayer.fromEvent().id;
	mice[playerId] = mice[playerId] = {
		leftDown: mice[playerId].leftDown,
		rightDown: mice[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
		targetLock: mice[playerId].targetLock,
	};
	return false;
};

const keyDownTrigger = new Trigger();
const onKeyDown = () => {
	const playerId = MapPlayer.fromEvent().id;
	keyboards[playerId].shiftDown = true;
	if (mice[playerId].leftDown) queueLeftAction(playerId);
	return false;
};

const keyUpTrigger = new Trigger();
const onKeyUp = () => {
	const playerId = MapPlayer.fromEvent().id;
	keyboards[playerId].shiftDown = false;
	if (mice[playerId].leftDown) queueMove(playerId);
	return false;
};

const ticker = new Timer();
const tick = () => {
	forEachHero((hero) => {
		const pid = hero.owner.id;
		if (mice[pid].leftDown && !mice[pid].targetLock) queueMove(pid);
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
	});

	mouseDownTrigger.addCondition(onMouseDown);
	mouseUpTrigger.addCondition(onMouseUp);
	mouseMoveTrigger.addCondition(onMouseMove);
	keyDownTrigger.addCondition(onKeyDown);
	keyUpTrigger.addCondition(onKeyUp);

	ticker.start(0.25, true, tick);
});
