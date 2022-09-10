import { createElement } from "w3ts-jsx";
import type { Hero } from "../../../units/Hero";

export const Inventory = (
  { hero, visible }: { hero: Hero; visible: boolean },
) => (
  <container
    size={{ width: 350, height: 496 }}
    absPosition={{ point: FRAMEPOINT_TOPRIGHT, x: 1600, y: 1200 - 350 }}
    visible={visible}
  >
    <backdrop texture="assets/img/inventory" position="parent" />
  </container>
);
