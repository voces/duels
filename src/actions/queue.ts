import { state } from "../states/state";
import { times } from "../util";

export type Done = (performNext?: boolean) => void;
export type Perform = (done: Done) => void;

interface Action {
  perform: Perform;
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

export const queueAction = (
  playerId: number,
  action: Action,
  interrupt = true,
): void => {
  if (state.state !== "grind") return;
  const queue = actionQueue[playerId];
  if (!queue.current || (queue.current.interruptable && interrupt)) {
    queue.current = action;
    action.perform((performNext = true) => {
      queue.current = undefined;
      if (queue.next) {
        if (performNext) {
          const next = queue.next;
          queue.next = undefined;
          queueAction(playerId, next);
        } else queue.next = undefined;
      }
    });
  } // else queue.next = action;
};
