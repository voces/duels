import { MapPlayer } from "@voces/w3ts";
import { createElement, Fragment, useEffect, useState } from "w3ts-jsx";

import { registerCommand } from "../input/commands/registry";
import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";
import { BottomBar } from "./windows/BottomBar";
import { Character } from "./windows/Character";
import { EnemyStatus } from "./windows/EnemyStatus";
import { Equipment } from "./windows/Equipment/index";
import { Inventory } from "./windows/Inventory";

export const App = () => {
  const state = useGlobalState();
  const [characterVisible, setCharacterVisible] = useState(false);
  const [equipmentVisible, setEquipmentVisible] = useState(true);
  const [inventoryVisible, setInventoryVisible] = useState(true);

  useEffect(() => {
    registerCommand({
      name: "Toggle character",
      shortcuts: [{ keyboard: "o" }],
      // More than move, allowing toggling while running
      priority: 2,
      fn: (playerId) => {
        if (playerId === MapPlayer.fromLocal().id) {
          setCharacterVisible((v) => !v);
        }
        return true;
      },
    });

    registerCommand({
      name: "Toggle inventory",
      shortcuts: [{ keyboard: "i" }],
      // More than move, allowing toggling while running
      priority: 2,
      fn: (playerId) => {
        if (playerId === MapPlayer.fromLocal().id) {
          setInventoryVisible((v) => !v);
        }
        return true;
      },
    });
  });

  return (
    <>
      {state.state === "hero-selection" && <HeroSelection />}
      {state.state !== "hero-selection" && state.state !== "initial" && (
        <>
          <Character
            hero={state.heroes[MapPlayer.fromLocal().id]}
            visible={characterVisible}
          />
          <BottomBar
            hero={state.heroes[MapPlayer.fromLocal().id]}
            toggleAttributesVisibile={() => setCharacterVisible((v) => !v)}
            toggleInventoryVisible={() => setInventoryVisible((v) => !v)}
          />
          {/* <Statuses hero={state.heroes[MapPlayer.fromLocal().id]} /> */}
          <EnemyStatus />
          <Equipment
            hero={state.heroes[MapPlayer.fromLocal().id]}
            visible={equipmentVisible}
          />
          <Inventory
            hero={state.heroes[MapPlayer.fromLocal().id]}
            visible={inventoryVisible}
          />
        </>
      )}
    </>
  );
};
