import "./polyfill";
import { tick } from "./polyfill";
import { adapter, setAdapter } from "w3ts-jsx";

setAdapter(adapter);

setInterval(() => {
  tick();
}, 1000 / 32);

import "../src/main";

Object.assign(globalThis, {
  gg_rct_camp: Rect(0, 0, 0, 0),
  gg_rct_bloodmore1: Rect(0, 0, 0, 0),
  gg_rct_bloodmore2: Rect(0, 0, 0, 0),
  gg_rct_bloodmore3: Rect(0, 0, 0, 0),
});

// SetPlayers would normally be called by the map lua...
SetPlayers(bj_MAX_PLAYER_SLOTS);
SetPlayerController(Player(0)!, MAP_CONTROL_USER);
(Player(0) as any).slotState = PLAYER_SLOT_STATE_PLAYING;

declare const config: () => void;
config();

declare const main: () => void;
main();

const root = document.querySelector("[name=ORIGIN_FRAME_GAME_UI]")!;
if (root instanceof HTMLElement) {
  root.style.fontSize = `calc(${root.style.height} / 1600 * 22)`;
}

let step: "init" | "selected" | "done" = "init";
let i = setInterval(() => {
  switch (step) {
    case "init": {
      const el = document.querySelector(
        "body > span > span:nth-child(14) > span",
      );
      if (!el || !(el instanceof HTMLElement)) return;
      el.click();
      step = "selected";
      break;
    }
    case "selected": {
      const el = document.querySelector("body > span > span:nth-child(18)");
      if (!el || !(el instanceof HTMLElement)) return;
      el.click();
      step = "done";
      break;
    }
    default:
      clearInterval(i);
  }
}, 1);
