// Let's try to keep the magic to a minimum!

import { colorize } from "./util";

const OldTriggerAddCondition = TriggerAddCondition;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TriggerAddCondition = (
	trigger: trigger,
	fn: conditionfunc | (() => void | boolean),
) => {
	const condition =
		typeof fn === "function"
			? Condition((): boolean => {
					try {
						const ret = fn();
						return typeof ret === "boolean" ? ret : false;
					} catch (err) {
						print(colorize.red(err));
					}
					return false;
			  })
			: fn;

	OldTriggerAddCondition(trigger, condition);
};
