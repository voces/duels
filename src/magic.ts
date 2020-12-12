// Let's try to keep the magic to a minimum!

import { colorize } from "./util/colorize";

const wrapAndPrint = <T>(fn: () => T, fallback: T) => () => {
	try {
		return fn();
	} catch (err) {
		print(colorize.error(err));
	}
	return fallback;
};

const OldTriggerAddCondition = TriggerAddCondition;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TriggerAddCondition = (
	trigger: trigger,
	fn: conditionfunc | (() => boolean),
) => {
	const condition =
		typeof fn === "function" ? Condition(wrapAndPrint(fn, false)) : fn;

	OldTriggerAddCondition(trigger, condition);
};

const OldTimerStart = TimerStart;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TimerStart = (
	whichTimer: timer,
	timeout: number,
	periodic: boolean,
	handlerFunc: () => void,
) =>
	OldTimerStart(
		whichTimer,
		timeout,
		periodic,
		wrapAndPrint(handlerFunc, null),
	);

const OldTriggerRegisterEnterRegion = TriggerRegisterEnterRegion;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TriggerRegisterEnterRegion = (
	whichTrigger: trigger,
	whichRegion: region,
	filter: boolexpr | (() => boolean) | null,
) => {
	const fn =
		typeof filter === "function"
			? Filter(wrapAndPrint(filter, false))
			: filter;

	OldTriggerRegisterEnterRegion(whichTrigger, whichRegion, fn);
};
