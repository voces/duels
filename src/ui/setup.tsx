import { addScriptHook, Timer, W3TS_HOOK } from "w3ts";
import * as React from "w3ts-jsx";

import { App } from "./App";

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	// We're going to re-use some things, like command buttons and portraits
	BlzEnableUIAutoPosition(false);
	// Remove defualt UI
	BlzHideOriginFrames(true);
	// Remove black bar at the bottom, which isn't remove from the above
	BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop", 0), false);

	// Disable drag selection boxes
	EnableDragSelect(false, false);
	// Disable selecting units
	EnableSelect(false, false);
	// Disable hover circles/tooltips over units
	EnablePreSelect(false, false);

	// Load our complex fdfs
	if (!BlzLoadTOCFile("assets/toc.toc"))
		print(`Unable to load toc "${"assets/toc.toc"}"`);

	new Timer().start(0.01, false, () => {
		Timer.fromExpired().destroy();
		React.render(<App />, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
	});
});
