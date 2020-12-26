import "./tests/setup";
import "./main";

import { Game, gameContext, initUI, wrapGame } from "w3api";
import { setWarnNotImplemented } from "w3api/dist/errors";

setWarnNotImplemented(true);

declare const main: () => {
	/* do nothing */
};
gameContext.withTemp(
	wrapGame((game: Game) => {
		initUI();
		main();
		const tick = () => {
			game.tick(1 / 32);
			setTimeout(tick, 1 / 32);
		};
		tick();
	}),
);
