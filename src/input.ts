import {
	addScriptHook,
	MapPlayer,
	Timer,
	Trigger,
	Unit,
	W3TS_HOOK,
} from "../node_modules/w3ts/index";
import { state } from "./states/state";
import { forEachHero, forEachPlayer, times } from "./util";

interface Mouse {
	leftDown: boolean;
	rightDown: boolean;
	x: number;
	y: number;
}

interface Keyboard {
	shiftDown: boolean;
}

interface MoveAction {
	type: "move";
	interruptable: true;
	perform: () => void;
}

interface AttackAction {
	type: "attack";
	target: widget | null;
	interruptable: false;
	perform: (done: () => void) => void;
}

type Action = MoveAction | AttackAction;

interface ActionQueue {
	current: Action | undefined;
	next: Action | undefined;
}

const mouse: Mouse[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	leftDown: false,
	rightDown: false,
	x: 0,
	y: 0,
}));

const keyboard: Keyboard[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	shiftDown: false,
}));

const actionQueue: ActionQueue[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	current: undefined,
	next: undefined,
}));

const queueAction = (playerId: number, action: Action) => {
	if (state.state !== "grind") return;
	const queue = actionQueue[playerId];
	if (!queue.current || queue.current.interruptable) {
		queue.current = action;
		action.perform(() => {
			queue.current = undefined;
			if (queue.next) {
				const next = queue.next;
				queue.next = undefined;
				queueAction(playerId, next);
			}
		});
	} else queue.next = action;
};

const attackAction = (
	hero: Unit,
	target: widget | null = null,
): AttackAction => ({
	type: "attack",
	target,
	interruptable: false,
	perform: (done) => {
		hero.issueImmediateOrder("stop");
		hero.setAnimation("attack");
		new Timer().start(1, false, () => {
			Timer.fromExpired().destroy();
			done();
		});
	},
});

const moveAction = (hero: Unit): MoveAction => ({
	type: "move",
	interruptable: true,
	perform: () => {
		const playerId = hero.owner.id;
		hero.issueOrderAt("move", mouse[playerId].x, mouse[playerId].y);
	},
});

const queueMove = (playerId: number) => {
	if (state.state !== "grind") return;
	const hero = state.heroes[playerId];
	queueAction(playerId, moveAction(hero));
};

const queueLeftAction = (playerId: number) => {
	if (state.state !== "grind") return;

	const hero = state.heroes[playerId];
	queueAction(playerId, attackAction(hero));
};

const mouseDownTrigger = new Trigger();
const onMouseDown = () => {
	const player = MapPlayer.fromEvent();
	const playerId = player.id;
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

	if (button === MOUSE_BUTTON_TYPE_LEFT)
		if (keyboard[playerId].shiftDown) queueLeftAction(playerId);
		else queueMove(playerId);

	// Enables keyboard listeners while the mouse is down
	if (GetLocalPlayer() === player.handle) EnableUserControl(true);

	return false;
};

const mouseUpTrigger = new Trigger();
const onMouseUp = () => {
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
};

const mouseMoveTrigger = new Trigger();
const onMouseMove = () => {
	const playerId = MapPlayer.fromEvent().id;
	mouse[playerId] = mouse[playerId] = {
		leftDown: mouse[playerId].leftDown,
		rightDown: mouse[playerId].rightDown,
		x: BlzGetTriggerPlayerMouseX(),
		y: BlzGetTriggerPlayerMouseY(),
	};
	return false;
};

const keyDownTrigger = new Trigger();
const onKeyDown = () => {
	const playerId = MapPlayer.fromEvent().id;
	keyboard[playerId].shiftDown = true;
	if (mouse[playerId].leftDown) queueLeftAction(playerId);
	return false;
};

const keyUpTrigger = new Trigger();
const onKeyUp = () => {
	const playerId = MapPlayer.fromEvent().id;
	keyboard[playerId].shiftDown = false;
	if (mouse[playerId].leftDown) queueMove(playerId);
	return false;
};

const ticker = new Timer();
const tick = () => {
	forEachHero((hero) => {
		const pid = hero.owner.id;
		if (mouse[pid].leftDown) queueMove(pid);
	});
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	forEachPlayer((player) => {
		mouseDownTrigger.registerPlayerMouseEvent(
			player,
			bj_MOUSEEVENTTYPE_DOWN,
		);
		mouseUpTrigger.registerPlayerMouseEvent(player, bj_MOUSEEVENTTYPE_UP);
		mouseUpTrigger.registerPlayerMouseEvent(player, bj_MOUSEEVENTTYPE_MOVE);
		keyDownTrigger.registerPlayerKeyEvent(player, OSKEY_LSHIFT, 1, true);
		keyUpTrigger.registerPlayerKeyEvent(player, OSKEY_LSHIFT, 0, false);
	});

	mouseDownTrigger.addCondition(Condition(onMouseDown));
	mouseUpTrigger.addCondition(Condition(onMouseUp));
	mouseMoveTrigger.addCondition(Condition(onMouseMove));
	keyDownTrigger.addCondition(Condition(onKeyDown));
	keyUpTrigger.addCondition(Condition(onKeyUp));

	ticker.start(0.25, true, tick);
});
