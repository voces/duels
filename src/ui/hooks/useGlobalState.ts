import { useEffect, useState } from "w3ts-jsx";
import {
  State,
  state,
  subStateChange,
  unsubStateChange,
} from "../../states/state";

// TODO: throw if fn changes
export const useGlobalState = <T extends unknown = State>(
  fn?: (state: State) => T,
): T => {
  const [oldState, setState] = useState(fn ? fn(state) : state);

  useEffect(() => {
    const listener = (newStateOrTransformer: State) => {
      // We clone the state to force a change
      if (!fn) return setState({ ...newStateOrTransformer });

      const newState = fn(newStateOrTransformer);

      if (
        !newState || typeof newState !== "object" ||
        !oldState || typeof oldState !== "object"
      ) {
        if (newState !== oldState) setState(newState);
        return;
      }

      const oldKeys = Object.keys(oldState);
      const newKeys = Object.keys(newState);

      if (oldKeys.length !== newKeys.length) return setState(newState);

      for (const key of newKeys) {
        if (
          oldState[key as keyof typeof oldState] !==
            newState[key as keyof typeof newState]
        ) return setState(newState);
      }
    };

    // Listen to state changes
    subStateChange(listener);

    // Stop listening when we unmount
    return () => unsubStateChange(listener);
  }, [oldState]);

  return oldState as T;
};
