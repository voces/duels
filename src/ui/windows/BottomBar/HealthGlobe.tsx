import { createElement } from "w3ts-jsx";
import { Hero } from "../../../units/Hero";
import { useUnitListener } from "../../hooks/useUnitListener";

export const HealthGlobe = ({ hero }: { hero: Hero }) => {
  useUnitListener(hero);

  return (
    <container
      position={{
        point: FRAMEPOINT_BOTTOMLEFT,
        relative: "parent",
        relativePoint: FRAMEPOINT_BOTTOMLEFT,
      }}
      size={{ height: 200, width: 400 }}
    >
      <backdrop
        position={{
          point: FRAMEPOINT_BOTTOMRIGHT,
          relative: "parent",
          relativePoint: FRAMEPOINT_BOTTOMRIGHT,
          x: -30,
          y: 19,
        }}
        texture="assets/img2/hp_loogtuyt_empty"
        size={{ height: 172, width: 172 }}
      >
        <backdrop
          position={{
            point: FRAMEPOINT_CENTER,
            relative: "parent",
            relativePoint: FRAMEPOINT_CENTER,
          }}
          texture="assets/img2/hp_loogtuyt"
          size={{
            height: (hero.health / hero.maxHealth) ** 0.5 * 172,
            width: (hero.health / hero.maxHealth) ** 0.5 * 172,
          }}
        />
        <text
          position={{
            point: FRAMEPOINT_BOTTOM,
            relative: "parent",
            relativePoint: FRAMEPOINT_TOP,
            y: 16,
          }}
          text={`${Math.round(hero.health)}/${Math.round(hero.maxHealth)}`}
        />
      </backdrop>
      <backdrop
        position="parent"
        texture="assets/img2/Left_ampoule"
      />
    </container>
  );
};
