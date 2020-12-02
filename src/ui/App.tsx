import * as React from "../../node_modules/w3ts-jsx/dist/src/index";
import { MapPlayer } from "../../node_modules/w3ts/index";
import { Attributes } from "./Attributes/Attributes";
import { BottomBar } from "./BottomBar/BottomBar";
import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";
import { Statuses } from "./Statuses/Statuses";

export const App = (): React.Node => {
	const state = useGlobalState();

	return (
		<container
			absPosition={[
				{
					point: FRAMEPOINT_TOPLEFT,
					x: 0,
					y: 1200,
				},
				{
					point: FRAMEPOINT_BOTTOMRIGHT,
					x: 1600,
					y: 0,
				},
			]}
		>
			{state.state === "hero-selection" && <HeroSelection />}
			{state.state !== "hero-selection" && state.state !== "initial" && (
				<>
					<Attributes />
					<BottomBar />
					<Statuses hero={state.heroes[MapPlayer.fromLocal().id]} />
				</>
			)}
		</container>
	);
};
