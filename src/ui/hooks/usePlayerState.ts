import { useState } from "w3ts-jsx";
import { times } from "../../util";

type UsePlayerStateReturn<T> = [
  T,
  (nextState: T) => void,
  T[],
  (nextStates: T[]) => void,
];

export function usePlayerState<T>(initial: T): UsePlayerStateReturn<T>;
export function usePlayerState<T>(
  initial: undefined,
  initials: T[],
): UsePlayerStateReturn<T>;
export function usePlayerState<T>(
  initial?: T,
  initials?: T[],
): [T, (nextState: T) => void, T[], (nextStates: T[]) => void] {
  const [state, setState] = useState<T[]>(
    initials ?? (times(bj_MAX_PLAYER_SLOTS, () => initial) as T[]),
  );
  const localPlayerId = GetPlayerId(GetLocalPlayer()!);
  return [
    state[localPlayerId],
    (nextState: T) => {
      setState(
        state
          .slice(0, localPlayerId)
          .concat(nextState, ...state.slice(localPlayerId + 1)),
      );
    },
    state,
    setState,
  ];
}
