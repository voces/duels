import { Timer, TimerDialog } from "../../node_modules/w3ts/index";
import { Hero } from "../units/Hero";
import { setGlobalState, state } from "./state";

export const advanceToGrindState = (heroes: Hero[]): void => {
	const timer = new Timer();
	const timerDialog = new TimerDialog(timer);
	timerDialog.setTitle("Time to duels...");
	timer.start(180, false, () => {
		if (state.state === "grind") state.grind.advance();
	});
	setGlobalState({
		state: "grind",
		grind: {
			advance: () => {
				print("start duels!");
			},
			timer,
			timerDialog,
		},
		heroes,
	});
};
