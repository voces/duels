import { useEffect, useForceUpdate } from "w3ts-jsx";
import { UnitEx } from "../../units/UnitEx";

export const useUnitListener = (unit: UnitEx | null): void => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    if (unit) {
      unit.addEventListener(forceUpdate);
      return () => unit.removeEventListener(forceUpdate);
    }
  }, [unit]);
};
