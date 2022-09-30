import { createElement, useRef, useState } from "w3ts-jsx";
import type { Hero } from "../../../units/Hero";
import { repeat } from "../../../util/repeat";
import { bottomRight, leftToRight, topDown, topLeft } from "../../util/pos";

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
      {repeat(42, (index) => (
        <backdrop
          position={index === 0
            ? topLeft({ y: -125.5, x: 14 })
            : index % 6 === 0
            ? topDown({ y: -2, x: -255 })
            : leftToRight({ x: 2 })}
          size={49}
          texture={hero.inventory[offset * 6 + index]?.image}
        />
      ))}
      <slider
        position={bottomRight({ x: -10, y: 10 })}
        size={{ height: 360, width: 20 }}
        minMaxValue={{ min: 0, max: 1000 }}
        stepSize={1}
        inherits="QuestMainListScrollBar"
        ref={mySlider}
        onSliderChanged={() => {
          console.log(BlzFrameGetValue(mySlider.current));
        }}
      />
    </container>
  );
};
