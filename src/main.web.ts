import "./tests/setup";
import "./main";

import { getGame, initUI } from "w3api";
import { setWarnNotImplemented } from "w3api/dist/errors";

setWarnNotImplemented(true);

declare const main: () => {
	/* do nothing */
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mutableGlobalThis: any = globalThis;

mutableGlobalThis.gg_rct_camp = Rect(0, 0, 0, 0);
mutableGlobalThis.gg_rct_bloodmore1 = Rect(0, 0, 0, 0);
mutableGlobalThis.gg_rct_bloodmore2 = Rect(0, 0, 0, 0);
mutableGlobalThis.gg_rct_bloodmore3 = Rect(0, 0, 0, 0);

const game = getGame();

mutableGlobalThis.game = game;

initUI();
main();
const tick = () => {
	game.tick(1 / 32);
	setTimeout(tick, 250);
};
tick();
