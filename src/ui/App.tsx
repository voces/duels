import { MapPlayer } from "w3ts";
import * as React from "w3ts-jsx";

import { registerCommand } from "../input/commands/registry";
import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";
import { BottomBar } from "./windows/BottomBar";
import { Character } from "./windows/Character/Character";
import { EnemyStatus } from "./windows/EnemyStatus";
import { Statuses } from "./windows/Statuses/Statuses";

export const App = (): React.Node => {
	const state = useGlobalState();
	const [characterVisible, setCharacterVisible] = React.useState(false);

	React.useEffect(() => {
		registerCommand({
			name: "Toggle character",
			shortcuts: [{ keyboard: "o" }],
			// More than move, allowing toggling while running
			priority: 2,
			fn: (playerId) => {
				if (playerId === MapPlayer.fromLocal().id)
					setCharacterVisible((v) => !v);
				return true;
			},
		});
	});

	return (
		<container>
			{state.state === "hero-selection" && <HeroSelection />}
			{state.state !== "hero-selection" && state.state !== "initial" && (
				<>
					<Character
						hero={state.heroes[MapPlayer.fromLocal().id]}
						visible={characterVisible}
					/>
					<BottomBar
						hero={state.heroes[MapPlayer.fromLocal().id]}
						toggleAttributesVisibile={() =>
							setCharacterVisible((v) => !v)
						}
					/>
					<Statuses hero={state.heroes[MapPlayer.fromLocal().id]} />
					<EnemyStatus />
				</>
			)}
		</container>
	);
};
