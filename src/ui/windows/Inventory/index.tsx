import { createElement, useCallback, useForceUpdate, useState } from "w3ts-jsx";
import { useItem } from "../../../items/equipping";
import type { Item } from "../../../items/Item";
import type { Hero } from "../../../units/Hero";
import { repeat } from "../../../util/repeat";
import { SmallText } from "../../components/Text";
import { Tooltip } from "../../components/Tooltip";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useHero } from "../../hooks/useHero";
import { useRefState } from "../../hooks/useRefState";
import { useUnitListener } from "../../hooks/useUnitListener";
import { genItemText } from "../../util/genItemText";
import {
  bottomRight,
  leftToRight,
  rightToLeft,
  top,
  topDown,
  topLeft,
} from "../../util/pos";

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
    const used = useItem(item, hero);
    if (!used) hero.equip(item);
    if (item.consumable) forceUpdate(); // render decreased stack count
  }, [item, hero]);

  return (
    <button
      inherits="IconButtonTemplate"
      position={index === 0
        ? topLeft({ y: -108, x: 13 })
        : index % 6 === 0
        ? topDown({ y: -2, x: -217.5 })
        : leftToRight({ x: 2 })}
      size={41.5}
      alpha={item ? 255 : 0}
      ref={containerRef}
      tooltip={containerRef.current &&
        (
          <Tooltip visible={!!item}>
            <text
              text={item ? genItemText(item) : undefined}
              position={rightToLeft({
                relative: containerRef.current,
                x: -28,
                y: -4,
              })}
            />
          </Tooltip>
        )}
      onClick={onClick}
    >
      <backdrop position="parent" texture={item?.image} />
      <SmallText
        position={bottomRight()}
        text={item?.stacks?.toString() ?? ""}
      />
    </button>
  );
};

export const Inventory = () => {
  const visible = useGlobalState((s) => !!s.inventoryVisible);
  const hero = useHero("inventory");
  const [offset, setOffset] = useState(0);
  // const mySlider = useRef<framehandle | null>(null);

  if (!hero) return null;

  return (
    <container
      size={{ width: 300, height: 425 }}
      absPosition={{ point: FRAMEPOINT_TOPRIGHT, x: 1600 - 64, y: 1200 - 544 }}
      visible={visible}
    >
      <backdrop texture="assets/img2/inventory" position="parent" />
      <text text="Inventory" position={top({ y: -82 })} />
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
