import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";

/**
 * Similar to useRef, except internally uses state to queue a re-render when
 * the value is changed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRefState = <T extends any>(initial: T): { current: T } => {
	const [state, setState] = React.useState<T>(initial);

	const obj = {};
	Object.defineProperty(obj, "current", {
		set(value) {
			setState(value);
		},
		get(): T {
			return state;
		},
	});

	return obj as { current: T };
};
