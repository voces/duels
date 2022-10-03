import { createElement, Fragment } from "w3ts-jsx";
import { setGlobalState } from "../states/state";
import { heroData, HeroType } from "../units/heroTypes";
import { everyPlayer } from "../util";
import { ExtraLargeText, LargeText } from "./components/Text";
import { Tooltip } from "./components/Tooltip";
import { useGlobalState } from "./hooks/useGlobalState";

const HeroPane = ({
  tooltip,
  x,
  width,
  onClick,
}: {
  tooltip: string;
  x: number;
  width: number;
  onClick: () => void;
}) => (
  <container
    absPosition={{
      point: FRAMEPOINT_TOPLEFT,
      x,
      y: 910,
    }}
    size={{ width, height: 385 }}
  >
    <button
      position="parent"
      onClick={onClick}
      tooltip={
        <Tooltip>
          <text
            text={tooltip}
            absPosition={{
              point: FRAMEPOINT_TOPLEFT,
              x: 64,
              y: 1200 - 64,
            }}
            size={{ width: 400, height: 0 }}
          />
        </Tooltip>
      }
    />
  </container>
);

const amazonTooltip = `Amazon
Specializes bows, javelins, and spears.`;

const assassinTooltip = `Assassin
Specializes in martial arts, shadow magic, and traps.`;

const necromancerTooltip = `Necromancer
Specializes in necromancy, poison, and bone spells as well as curses.`;

const barbarianTooltip = `Barbarian
Specializes in heavy combat.`;

const paladinTooltip = `Paladin
Specializes in combat, holy magic, and auras.`;

const sorceressTooltip = `Sorceress
Specializes in fire, lightning, and cold spells.`;

const druidTooltip = `Druid
Specializes in elemental, shape shifting, and summoning spells.`;

export const HeroSelection = () => {
  const globalState = useGlobalState();

  const triggerPlayerId = GetPlayerId(GetTriggerPlayer()!);

  const selected = globalState.state === "hero-selection"
    ? globalState.heroSelection.selections[triggerPlayerId] ?? "amazon"
    : "amazon";
  const setSelected = (hero: HeroType) => {
    if (globalState.state !== "hero-selection") return;
    setGlobalState({
      ...globalState,
      heroSelection: {
        ...globalState.heroSelection,
        selections: [
          ...globalState.heroSelection.selections.slice(
            0,
            triggerPlayerId,
          ),
          hero,
          ...globalState.heroSelection.selections.slice(
            triggerPlayerId + 1,
          ),
        ],
      },
    });
  };

  const onSelect = () => {
    if (globalState.state !== "hero-selection") return;

    if (
      everyPlayer(
        (player) =>
          globalState.heroSelection.selections[player.id] != null ||
          player.controller !== MAP_CONTROL_USER ||
          player.slotState !== PLAYER_SLOT_STATE_PLAYING,
      )
    ) {
      if (globalState.state !== "hero-selection") return;
      globalState.heroSelection.advance();
    }
  };

  return (
    <>
      <ExtraLargeText
        text="Select hero class"
        absPosition={{ point: FRAMEPOINT_CENTER, x: 0.4, y: 0.55 }}
      />
      <LargeText
        text={heroData[selected].name}
        absPosition={{ point: FRAMEPOINT_CENTER, x: 0.4, y: 0.5 }}
      />
      <HeroPane
        tooltip={amazonTooltip}
        x={75}
        width={200}
        onClick={() => setSelected("amazon")}
      />
      <HeroPane
        tooltip={assassinTooltip}
        x={280}
        width={185}
        onClick={() => setSelected("assassin")}
      />
      <HeroPane
        tooltip={necromancerTooltip}
        x={475}
        width={200}
        onClick={() => setSelected("necromancer")}
      />
      <HeroPane
        tooltip={barbarianTooltip}
        x={690}
        width={170}
        onClick={() => setSelected("barbarian")}
      />
      <HeroPane
        tooltip={paladinTooltip}
        x={875}
        width={195}
        onClick={() => setSelected("paladin")}
      />
      <HeroPane
        tooltip={sorceressTooltip}
        x={1080}
        width={190}
        onClick={() => setSelected("sorceress")}
      />
      <HeroPane
        tooltip={druidTooltip}
        x={1310}
        width={250}
        onClick={() => setSelected("druid")}
      />
      <gluetextbutton
        inherits="ScriptDialogButton"
        text="Select"
        absPosition={{ point: FRAMEPOINT_CENTER, x: 0.4, y: 0.08 }}
        size={{ width: 200, height: 60 }}
        onClick={onSelect}
      />
    </>
  );
};
