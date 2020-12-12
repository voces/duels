import * as React from "w3ts-jsx";
import {
	State,
	state,
	subStateChange,
	unsubStateChange,
} from "../../states/state";

export const useGlobalState = (): State => {
	const [lState, setState] = React.useState(state);

	React.useEffect(() => {
		// Listen to state changes
		subStateChange((state) => {
			// We clone the state to force a change
			setState({ ...state });
		});

		// Stop listening when we unmount
		return () => unsubStateChange(setState);
	});

	return lState;
};
