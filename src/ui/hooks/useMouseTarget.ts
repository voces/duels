import { useEffect } from "w3ts-jsx";
import { EffectiveTargetChangeEvent, input, mice } from "../../input/data";
import { UnitEx } from "../../units/UnitEx";
import { usePlayerState } from "./usePlayerState";

export const useMouseTarget = (): UnitEx | null => {
  const [unit, , units, setUnits] = usePlayerState<UnitEx | null>(null);

  useEffect(() => {
    const fn = (e: EffectiveTargetChangeEvent) => {
      const mouse = mice[e.playerId];
      setUnits([
        ...units.splice(0, e.playerId),
        mouse.targetLock ?? mouse.target,
        ...units.splice(e.playerId + 1),
      ]);
    };
    input.addEventListener("effectivetargetchange", fn);

    return () => input.removeEventListener("effectivetargetchange", fn);
  });

  return unit;
};
