import { createElement } from "w3ts-jsx";
import { Hero } from "../../../units/Hero";
import { HealthGlobe } from "./HealthGlobe";
import { ManaGlobe } from "./ManaGlobe";
import { Menu } from "./Menu";
import { SkillBar } from "./SkillBar";

export const BottomBar = ({
  toggleAttributesVisibile,
  toggleInventoryVisible,
  hero,
}: {
  toggleAttributesVisibile: () => void;
  toggleInventoryVisible: () => void;
  hero: Hero;
}) => (
  <container
    absPosition={{
      point: FRAMEPOINT_BOTTOMLEFT,
      y: 0,
      x: 1600 / 2 - 1680 * 0.8 / 2,
    }}
    size={{ width: 1680, height: 200 }}
    scale={0.8}
  >
    <HealthGlobe hero={hero} />
    <SkillBar />
    <ManaGlobe hero={hero} />
    <Menu
      toggleAttributesVisibile={toggleAttributesVisibile}
      toggleInventoryVisible={toggleInventoryVisible}
    />
  </container>
);
