import { createElement } from "w3ts-jsx";
import { useHero } from "../../hooks/useHero";
import { above, bottomLeft, bottomRight, center } from "../../util/pos";

export const HealthGlobe = () => {
  const hero = useHero("health");

  if (!hero) return null;

  return (
    <container
      position={bottomLeft()}
      size={{ height: 200, width: 400 }}
    >
      <backdrop
        position={bottomRight({ x: -30, y: 19 })}
        texture="assets/img2/hp_loogtuyt_empty"
        size={172}
      >
        <backdrop
          position={center()}
          texture="assets/img2/hp_loogtuyt"
          size={(hero.health / hero.maxHealth) ** 0.5 * 172}
        />
        <text
          position={above({ y: 16 })}
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
