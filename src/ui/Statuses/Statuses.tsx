import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { Hero } from "../../Hero";
import { useUnitListener } from "../hooks/useUnitListener";
import { Status } from "./Status";

export const Statuses = ({ hero }: { hero: Hero }): React.Node => {
	useUnitListener(hero);

	return (
		<container
			absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 16, y: 1200 - 16 }}
			size={{ width: 1, height: 1 }}
		>
			<Status unit={hero} first />
		</container>
	);
};
