import { createElement } from "w3ts-jsx";
import { Hero } from "../../../units/Hero";
import { useUnitListener } from "../../hooks/useUnitListener";

export const ManaGlobe = ({ hero }: { hero: Hero }) => {
  useUnitListener(hero);

  return (
    <container
      position={{
        point: FRAMEPOINT_BOTTOMLEFT,
        relative: "previous",
        relativePoint: FRAMEPOINT_BOTTOMRIGHT,
      }}
      size={{ height: 200, width: 400 }}
    >
      <backdrop
        position={{
          point: FRAMEPOINT_BOTTOMLEFT,
          relative: "parent",
          relativePoint: FRAMEPOINT_BOTTOMLEFT,
          x: 30,
          y: 19,
        }}
        texture="assets/img2/mp_loogtuyt_empty"
        size={{ height: 172, width: 172 }}
      >
        <backdrop
          position={{
            point: FRAMEPOINT_CENTER,
            relative: "parent",
            relativePoint: FRAMEPOINT_CENTER,
          }}
          texture="assets/img2/mp_loogtuyt"
          size={{
            height: (hero.mana / hero.maxMana) ** 0.5 * 172,
            width: (hero.mana / hero.maxMana) ** 0.5 * 172,
          }}
        />
        <text
          position={{
            point: FRAMEPOINT_BOTTOM,
            relative: "parent",
            relativePoint: FRAMEPOINT_TOP,
            y: 16,
          }}
          text={`${Math.round(hero.mana)}/${Math.round(hero.maxMana)}`}
        />
      </backdrop>
      <backdrop
        position="parent"
        texture="assets/img2/Right_ampoule"
      />
    </container>
  );
};
