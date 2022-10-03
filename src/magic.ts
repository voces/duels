// Let's try to keep the magic to a minimum!

import { colorize } from "./util/colorize";

const wrapAndPrint = <T>(fn: () => T, fallback: T) => () => {
  try {
    return fn();
  } catch (err) {
    console.log(colorize.error(err));
  }
  return fallback;
};

const OldTriggerAddCondition = TriggerAddCondition;
// @ts-ignore
TriggerAddCondition = (trigger: trigger, fn: boolexpr) => {
  const condition = typeof fn === "function"
    ? Condition(wrapAndPrint(fn, false))!
    : fn;

  OldTriggerAddCondition(trigger, condition);
};

const OldTimerStart = TimerStart;
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
// @ts-ignore
TriggerRegisterEnterRegion = (
  whichTrigger: trigger,
  whichRegion: region,
  filter?: boolexpr | (() => boolean) | undefined,
) => {
  const fn = typeof filter === "function"
    ? Filter(wrapAndPrint(filter, false))
    : filter;

  OldTriggerRegisterEnterRegion(whichTrigger, whichRegion, fn);
};
