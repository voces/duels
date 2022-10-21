import { GetLocalPlayerId } from "../../util/natives";
import { useGlobalState } from "./useGlobalState";
import { useUnitListener } from "./useUnitListener";

export const useHero = (...keys: [string, ...string[]]) => {
  const [hero] = useGlobalState((
    state,
  ) => [state.heroes?.[GetLocalPlayerId()]]);

  useUnitListener(hero, ...keys);

  return hero;
};
