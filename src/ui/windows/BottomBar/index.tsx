import { createElement } from "w3ts-jsx";
import { HealthGlobe } from "./HealthGlobe";
import { ManaGlobe } from "./ManaGlobe";
import { Menu } from "./Menu";
import { SkillBar } from "./SkillBar";

export const BottomBar = () => (
  <container
    absPosition={{
      point: FRAMEPOINT_BOTTOMLEFT,
      y: 0,
      x: 1600 / 2 - 1680 * 0.8 / 2,
    }}
    size={{ width: 1680, height: 200 }}
    scale={0.8}
  >
    <HealthGlobe />
    <SkillBar />
    <ManaGlobe />
    <Menu />
  </container>
);
