import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { UnitEx } from "../../units/UnitEx";

export const useUnitListener = (unit: UnitEx | null): void => {
	const forceUpdate = React.useForceUpdate();
	React.useEffect(() => {
		if (unit) {
			unit.addEventListener(forceUpdate);
			return () => unit.removeEventListener(forceUpdate);
		}
	}, [unit]);
};
