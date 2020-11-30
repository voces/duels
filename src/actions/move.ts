import { Hero } from "../Hero";
import { mice } from "../input/data";
import { startInterval, startTimeout } from "../util";
import { Perform } from "./queue";

interface MoveAction {
	type: "move";
	interruptable: true;
	perform: Perform;
}

export function moveAction(this: void, hero: Hero): MoveAction;
export function moveAction(
	this: void,
	hero: Hero,
	condition: () => boolean,
	timeout: number,
): MoveAction;
export function moveAction(
	this: void,
	hero: Hero,
	condition?: () => boolean,
	timeout?: number,
): MoveAction {
	return {
		type: "move",
		interruptable: true,
		perform: (done: () => void) => {
			const playerId = hero.owner.id;
			hero.unit.issueOrderAt("move", mice[playerId].x, mice[playerId].y);

			// If we have a condition and timeout, we'll loop checking the
			// condition until it resolves true. We always have a timeout to
			// prevent character locking.
			if (condition && timeout) {
				const interval = startInterval(0.1, () => {
					if (condition()) {
						interval();
						myTimeout();
						done();
					}
				});

				const myTimeout = startTimeout(timeout, () => {
					interval();
					done();
				});

				// If we don't have a condition, just immediately complete the
				// action
			} else done();
		},
	};
}
