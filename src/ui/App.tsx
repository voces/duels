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
import { SkillTree } from "./windows/SkillTree";

export const App = () => {
  const state = useGlobalState();
  const [characterVisible, setCharacterVisible] = useState(false);
  const [equipmentVisible, setEquipmentVisible] = useState(false);
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [skillTreeVisible, setSkillTreeVisible] = useState(true);

  return (
    <>
      {state.state === "hero-selection" && <HeroSelection />}
      {state.state !== "hero-selection" && state.state !== "initial" && (
        <>
          <Character
            hero={state.heroes[MapPlayer.fromLocal().id]}
            visible={characterVisible}
          />
          <SkillTree visible={skillTreeVisible} />
          <BottomBar
            hero={state.heroes[MapPlayer.fromLocal().id]}
            toggleAttributesVisibile={() => setCharacterVisible((v) => !v)}
            toggleInventoryVisible={() => setInventoryVisible((v) => !v)}
            toggleEquipmentVisible={() => setEquipmentVisible((v) => !v)}
            toggleSkillTreeVisible={() => setSkillTreeVisible((v) => !v)}
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
