import { MapPlayer } from "@voces/w3ts";
import { createElement, Fragment, useState } from "w3ts-jsx";

import { HeroSelection } from "./HeroSelection";
import { useGlobalState } from "./hooks/useGlobalState";
import { BottomBar } from "./windows/BottomBar";
import { Character } from "./windows/Character";
import { EnemyStatus } from "./windows/EnemyStatus";
import { Equipment } from "./windows/Equipment/index";
import { Inventory } from "./windows/Inventory";
import { SkillTree } from "./windows/SkillTree";

export const App = () => {
  const state = useGlobalState((state) => ({ state: state.state }));

  return (
    <>
      {state.state === "hero-selection" && <HeroSelection />}
      {state.state !== "hero-selection" && state.state !== "initial" && (
        <>
          <Character />
          <SkillTree />
          <BottomBar />
          {/* <Statuses hero={state.heroes[MapPlayer.fromLocal().id]} /> */}
          <EnemyStatus />
          <Equipment />
          <Inventory />
        </>
      )}
    </>
  );
};
