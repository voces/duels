import { createElement } from "w3ts-jsx";

import { Hero } from "../../../units/Hero";
import { Status } from "./Status";

export const Statuses = ({ hero }: { hero: Hero }) => (
  <container
    absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 16, y: 1200 - 16 }}
    size={1}
  >
    <Status unit={hero} first />
  </container>
);
