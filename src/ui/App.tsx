import * as React from "../../node_modules/w3ts-jsx/dist/src/index";
import { MapPlayer } from "../../node_modules/w3ts/index";
import { registerCommand } from "../input/commands/registry";
import { log } from "../util";
import { BottomBar } from "./BottomBar/BottomBar";
import { Character } from "./Character/Character";
import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";
import { Statuses } from "./Statuses/Statuses";

export const App = (): React.Node => {
	const state = useGlobalState();
	const [characterVisible, setCharacterVisible] = React.useState(false);

	React.useEffect(() => {
		registerCommand({
			name: "Toggle character",
			shortcuts: [{ keyboard: "o" }],
			fn: (playerId) => {
				if (playerId === MapPlayer.fromLocal().id)
					setCharacterVisible((v) => !v);
				return true;
			},
		});
	});

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
					<Character
						hero={state.heroes[MapPlayer.fromLocal().id]}
						visible={characterVisible}
					/>
					<BottomBar
						toggleAttributesVisibile={() =>
							setCharacterVisible((v) => {
								log("was", v);
								return !v;
							})
						}
					/>
					<Statuses hero={state.heroes[MapPlayer.fromLocal().id]} />
				</>
			)}
		</container>
	);
};
