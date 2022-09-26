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
SetPlayerController(Player(0), MAP_CONTROL_USER);
(Player(0) as any).slotState = PLAYER_SLOT_STATE_PLAYING;

declare const config: () => void;
config();

declare const main: () => void;
main();

const root = document.querySelector("[name=ORIGIN_FRAME_GAME_UI]")!;
if (root instanceof HTMLElement) {
  root.style.fontSize = `calc(${root.style.height} / 1600 * 22)`;
}
