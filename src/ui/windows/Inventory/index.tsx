import { createElement, useCallback, useForceUpdate, useState } from "w3ts-jsx";
import { useItem } from "../../../items/equipping";
import type { Item } from "../../../items/Item";
import type { Hero } from "../../../units/Hero";
import { repeat } from "../../../util/repeat";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { useUnitListener } from "../../hooks/useUnitListener";
import { bottomRight, leftToRight, topDown, topLeft } from "../../util/pos";

const genItemText = (item: Item) =>
  [
    item.name,
    ...(item.effects?.map((effect) => {
      switch (effect.type) {
        case "restoreHealth":
          return `Restores ${effect.amount} health on use`;
        case "restoreMana":
          return `Restores ${effect.amount} mana on use`;
        case "skillBonus":
          return `+${effect.levels} to ${effect.skill}`;
        case "weaponDamageMultiplier":
          return `+${effect.multipler * 100}% ${effect.type} damage`;
      }
    }).filter((v) => v !== undefined) ?? []),
  ].join("|n");

const ItemSlot = (
  { hero, item, index }: {
    hero: Hero;
    item: Item | undefined;
    index: number;
  },
) => {
  const containerRef = useRefState<framehandle | null>(null);
  const forceUpdate = useForceUpdate();
  const onClick = useCallback(() => {
    if (!item) return;
    useItem(item, hero);
    forceUpdate(); // render decreased stack count
  }, [item, hero]);

  return (
    <button
      inherits="IconButtonTemplate"
      position={index === 0
        ? topLeft({ y: -125.5, x: 14 })
        : index % 6 === 0
        ? topDown({ y: -2, x: -255 })
        : leftToRight({ x: 2 })}
      size={49}
      alpha={item ? 255 : 0}
      ref={containerRef}
      tooltip={containerRef.current &&
        (
          <Tooltip visible={!!item}>
            <text
              text={item ? genItemText(item) : undefined}
              position={{
                point: FRAMEPOINT_TOPRIGHT,
                relative: containerRef.current,
                relativePoint: FRAMEPOINT_TOPLEFT,
                x: -28,
                y: -16,
              }}
            />
          </Tooltip>
        )}
      onClick={onClick}
    >
      <backdrop position="parent" texture={item?.image} />
      <text
        position={bottomRight({ x: -3, y: -3 })}
        text={item?.stacks?.toString() ?? ""}
      />
    </button>
  );
};

export const Inventory = (
  { hero, visible }: { hero: Hero; visible: boolean },
) => {
  useUnitListener(hero, "inventory");
  const [offset, setOffset] = useState(0);
  // const mySlider = useRef<framehandle | null>(null);

  return (
    <container
      size={{ width: 350, height: 496 }}
      absPosition={{ point: FRAMEPOINT_TOPRIGHT, x: 1600, y: 1200 - 350 }}
      visible={visible}
    >
      <backdrop texture="assets/img2/inventory" position="parent" />
      {repeat(
        42,
        (index) => (
          <ItemSlot
            hero={hero}
            item={hero.inventory[offset * 6 + index]}
            index={index}
          />
        ),
      )}
      {
        /* <slider
        position={bottomRight({ x: -10, y: 10 })}
        size={{ height: 360, width: 20 }}
        minMaxValue={{ min: 0, max: 1000 }}
        stepSize={1}
        inherits="QuestMainListScrollBar"
        ref={mySlider}
        onSliderChanged={() => {
          console.log(BlzFrameGetValue(mySlider!.current!));
        }}
      /> */
      }
    </container>
  );
};
