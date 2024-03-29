import "./areas/index";
import "./hostiles/damage";
import "./input/commands/default";
import "./input/input";
import "./magic";
import "./states/heroSelection";
import "./ui/setup";
import "./util/log";
import "./systems/Regeneration";
import "./systems/Projectile";

import { addScriptHook, MapPlayer, W3TS_HOOK } from "@voces/w3ts";

const isHuman = (player: MapPlayer) => player.id < 16;
const isNPC = (player: MapPlayer) => player.id === PLAYER_NEUTRAL_PASSIVE;
const isHostile = (player: MapPlayer) => !isHuman(player) && !isNPC(player);

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
  for (let i = 0; i < bj_MAX_PLAYERS + 4; i++) {
    for (let n = 0; n < bj_MAX_PLAYERS + 4; n++) {
      if (i === n) continue;
      const player1 = MapPlayer.fromIndex(i)!;
      const player2 = MapPlayer.fromIndex(n)!;
      let passive: boolean;
      // Non-hostiles start out passive with eachother
      if (!isHostile(player1)) passive = !isHostile(player2);
      // Hostiles start out passive with each other
      else passive = isHostile(player2);
      player1.setAlliance(player2, ALLIANCE_PASSIVE, passive);
    }
  }
});
