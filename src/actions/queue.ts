import { state } from "../states/state";
import { times } from "../util";

interface Action {
	perform: (done: () => void) => void;
	interruptable: boolean;
}

interface ActionQueue {
	current: Action | undefined;
	next: Action | undefined;
}

const actionQueue: ActionQueue[] = times(bj_MAX_PLAYER_SLOTS, () => ({
	current: undefined,
	next: undefined,
}));

export const queueAction = (playerId: number, action: Action): void => {
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
