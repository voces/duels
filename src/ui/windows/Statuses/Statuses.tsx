import * as React from "w3ts-jsx";

import { Hero } from "../../../units/Hero";
import { useUnitListener } from "../../hooks/useUnitListener";
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
