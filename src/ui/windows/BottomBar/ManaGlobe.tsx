import { createElement } from "w3ts-jsx";
import { useHero } from "../../hooks/useHero";
import { above, bottomLeft, center, leftToRight } from "../../util/pos";

export const ManaGlobe = () => {
  const hero = useHero("mana");

  if (!hero) return null;

  return (
    <container
      position={leftToRight(undefined, "bottom")}
      size={{ height: 200, width: 400 }}
    >
      <backdrop
        position={bottomLeft({ x: 30, y: 19 })}
        texture="assets/img2/mp_loogtuyt_empty"
        size={172}
      >
        <backdrop
          position={center()}
          texture="assets/img2/mp_loogtuyt"
          size={(hero.mana / hero.maxMana) ** 0.5 * 172}
        />
        <text
          position={above({ y: 16 })}
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
