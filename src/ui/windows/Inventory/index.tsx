import { createElement, useRef, useState } from "w3ts-jsx";
import type { Item } from "../../../items/Item";
import type { Hero } from "../../../units/Hero";
import { repeat } from "../../../util/repeat";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { bottomRight, leftToRight, topDown, topLeft } from "../../util/pos";

const ItemSlot = (
  { item, index }: { item: Item | undefined; index: number },
) => {
  const backdropRef = useRefState<framehandle | null>(null);

  return (
    <backdrop
      position={index === 0
        ? topLeft({ y: -125.5, x: 14 })
        : index % 6 === 0
        ? topDown({ y: -2, x: -255 })
        : leftToRight({ x: 2 })}
      size={49}
      texture={item?.image}
      alpha={item ? 255 : 0}
      ref={backdropRef}
      tooltip={
        <Tooltip>
          <text
            text={item?.name}
            position={backdropRef.current
              ? {
                point: FRAMEPOINT_RIGHT,
                relative: backdropRef.current,
                relativePoint: FRAMEPOINT_LEFT,
                x: -32,
              }
              : null}
          />
        </Tooltip>
      }
    >
      <text
        position={bottomRight({ x: -3, y: -3 })}
        text={item?.stacks?.toString() ?? ""}
      />
    </backdrop>
  );
};

export const Inventory = (
  { hero, visible }: { hero: Hero; visible: boolean },
) => {
  const [offset, setOffset] = useState(0);
  const mySlider = useRef<framehandle | null>(null);

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
          <ItemSlot item={hero.inventory[offset * 6 + index]} index={index} />
        ),
      )}
      <slider
        position={bottomRight({ x: -10, y: 10 })}
        size={{ height: 360, width: 20 }}
        minMaxValue={{ min: 0, max: 1000 }}
        stepSize={1}
        inherits="QuestMainListScrollBar"
        ref={mySlider}
        onSliderChanged={() => {
          console.log(BlzFrameGetValue(mySlider!.current!));
        }}
      />
    </container>
  );
};
