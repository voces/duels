import { useEffect, useForceUpdate } from "w3ts-jsx";
import { UnitEx } from "../../units/UnitEx";

export const useUnitListener = (
  unit: UnitEx | null,
  ...keys: [string, ...string[]]
): void => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    if (!unit) return;

    for (const key of keys) unit.addEventListener(key, forceUpdate);

    return () => {
      for (const key of keys) unit.removeEventListener(key, forceUpdate);
    };
  }, [unit, keys.join("|")]);
};
