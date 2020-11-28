import {
	addScriptHook,
	MapPlayer,
	Timer,
	Trigger,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { forEachHero, forEachPlayer, times } from "../util";

interface Mouse {
	leftDown: boolean;
	rightDown: boolean;
	x: number;
	y: number;
}

const mouse: Mouse[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	leftDown: false,
	rightDown: false,
	x: 0,
	y: 0,
}));

const mouseDownTrigger = new Trigger();
mouseDownTrigger.addCondition(() => {
	const playerId = MapPlayer.fromEvent().id;
	const button = BlzGetTriggerPlayerMouseButton();
	mouse[playerId] = {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT ? true : mouse[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? true
				: mouse[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
	};
	return false;
});

const mouseUpTrigger = new Trigger();
mouseUpTrigger.addCondition(() => {
	const playerId = MapPlayer.fromEvent().id;
	const button = BlzGetTriggerPlayerMouseButton();
	mouse[playerId] = mouse[playerId] = {
		leftDown:
			button === MOUSE_BUTTON_TYPE_LEFT
				? false
				: mouse[playerId].leftDown,
		rightDown:
			button === MOUSE_BUTTON_TYPE_RIGHT
				? false
				: mouse[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
	};
	return false;
});

const mouseMoveTrigger = new Trigger();
mouseMoveTrigger.addCondition(() => {
	const playerId = MapPlayer.fromEvent().id;
	mouse[playerId] = mouse[playerId] = {
		leftDown: mouse[playerId].leftDown,
		rightDown: mouse[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
	};
	return false;
});

const ticker = new Timer();
const tick = () => {
	forEachHero((hero) => {
		const pid = hero.owner.id;
		if (mouse[pid].leftDown)
			hero.issueOrderAt("move", mouse[pid].x, mouse[pid].y);
	});
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	forEachPlayer((player) => {
		mouseDownTrigger.registerPlayerMouseEvent(
			player,
			bj_MOUSEEVENTTYPE_DOWN,
		);

		mouseUpTrigger.registerPlayerMouseEvent(player, bj_MOUSEEVENTTYPE_UP);
	});

	ticker.start(0.03, true, tick);
});
