import { adapter, createElement, render, setAdapter } from "w3ts-jsx";
import { addScriptHook, Timer, W3TS_HOOK } from "@voces/w3ts";

import { App } from "./App";

setAdapter(adapter);

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  // We're going to re-use some things, like command buttons and portraits
  BlzEnableUIAutoPosition(false);
  // Remove defualt UI
  BlzHideOriginFrames(true);
  // Remove black bar at the bottom, which isn't remove from the above
  BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop", 0), false);
  BlzFrameSetVisible(
    BlzFrameGetChild(BlzGetFrameByName("ConsoleUI", 0), 5),
    false,
  );

  // Disable drag selection boxes
  EnableDragSelect(false, false);
  // Disable selecting units
  EnableSelect(false, false);
  // Disable hover circles/tooltips over units
  EnablePreSelect(false, false);

  // Load our complex fdfs
  if (!BlzLoadTOCFile("assets/toc.toc")) {
    console.log(`Unable to load toc "${"assets/toc.toc"}"`);
  }

  new Timer().start(0.01, false, () => {
    Timer.fromExpired().destroy();
    render(<App />, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
  });
});
