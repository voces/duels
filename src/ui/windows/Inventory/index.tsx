import { createElement, useState } from "w3ts-jsx";
import type { Hero } from "../../../units/Hero";
import { repeat } from "../../../util/repeat";
import { bottomRight, leftToRight, topDown } from "../../util/pos";

export const Inventory = (
  { hero, visible }: { hero: Hero; visible: boolean },
) => {
  const [offset, setOffset] = useState(0);

  return (
    <container
      size={{ width: 350, height: 496 }}
      absPosition={{ point: FRAMEPOINT_TOPRIGHT, x: 1600, y: 1200 - 350 }}
      visible={visible}
      // @ts-ignore
      onMouseWheel={() => {
        console.log("foobar");
      }}
    >
      <backdrop texture="assets/img2/inventory" position="parent" />
      {repeat(42, (index) => (
        <backdrop
          position={index === 0
            ? {
              point: FRAMEPOINT_TOPLEFT,
              relative: "parent",
              relativePoint: FRAMEPOINT_TOPLEFT,
              y: -125.5,
              x: 14,
            }
            : index % 6 === 0
            ? topDown({ y: -2, x: -255 })
            : leftToRight({ x: 2 })}
          size={49}
          texture={hero.inventory[offset * 6 + index]?.image ??
            "assets/img2/green"}
        />
      ))}
      <scrollbar position={bottomRight()} size={50} />
    </container>
  );
};
