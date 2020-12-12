import { Timer, TimerDialog } from "../../node_modules/w3ts/index";
import { Hero } from "../units/Hero";
import { HeroType } from "../units/heroTypes";

interface InitialState {
	state: "initial";
}

interface HeroSelectionState {
	state: "hero-selection";
	heroSelection: {
		advance: () => void;
		selections: HeroType[];
		timer: Timer;
		timerDialog: TimerDialog;
	};
}

interface GrindState {
	state: "grind";
	grind: {
		advance: () => void;
		timer: Timer;
		timerDialog: TimerDialog;
	};
	heroes: Hero[];
}

export type State = InitialState | HeroSelectionState | GrindState;

export const state: State = {
	state: "initial",
};

const subs: ((newState: State) => void)[] = [];

export const setGlobalState = (newState: State): void => {
	// This looks dirty, but it should work...
	let prop: keyof State;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	for (prop in state) delete (state as any)[prop];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	for (prop in newState) (state as any)[prop] = newState[prop];

	subs.forEach((sub) => sub(state));
};

export const subStateChange = (fn: (newState: State) => void): void => {
	subs.push(fn);
};

export const unsubStateChange = (fn: (newState: State) => void): boolean => {
	const idx = subs.indexOf(fn);
	if (idx >= 0) {
		subs.splice(idx, 1);
		return true;
	}
	return false;
};
