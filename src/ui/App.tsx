import * as React from "../../node_modules/w3ts-jsx/dist/src/index";
import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";

export const App = (): React.Node => {
	const state = useGlobalState();

	return (
		<container>
			{state.state === "hero-selection" && <HeroSelection />}
		</container>
	);
};