import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { UnitEx } from "../../UnitEx";

export const useUnitListener = (unit: UnitEx): void => {
	const forceUpdate = React.useForceUpdate();
	React.useEffect(() => {
		unit.addEventListener(forceUpdate);
		return () => unit.removeEventListener(forceUpdate);
	});
};
