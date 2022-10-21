import { createElement } from "w3ts-jsx";
import { damageRangeToString } from "../../../damage";
import {
  primaryCommands,
  secondaryCommands,
} from "../../../input/commands/registry";
import { Hero } from "../../../units/Hero";
import { heroTypeMap } from "../../../units/heroTypes";
import { MediumText } from "../../components/Text";
import { useUnitListener } from "../../hooks/useUnitListener";
import { bottomRight, top, topLeft } from "../../util/pos";
import { Row } from "./Row";

const capitalize = <T extends string>(string: T): Capitalize<T> =>
  (string[0].toUpperCase() + string.slice(1)) as Capitalize<T>;

const incStat = (
  hero: Hero,
  stat: "strength" | "dexterity" | "vitality" | "energy",
) => {
  if (hero.unasignedStatPoints <= 0) return;
  hero.unasignedStatPoints--;
  hero[`base${capitalize(stat)}`]++;
};

export const Character = ({
  hero,
  visible,
}: {
  hero: Hero;
  visible: boolean;
}) => {
  useUnitListener(
    hero,
    "experience",
    "stats",
    "strength",
    "weapon",
    "dexterity",
    "vitality",
    "stamina",
    "health",
    "energy",
    "mana",
  );
  const primary = primaryCommands[hero.owner.id];
  const secondary = secondaryCommands[hero.owner.id];
  return (
    <container
      size={{ width: 300, height: 600 }}
      absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 112, y: 1200 - 282 }}
      visible={visible}
    >
      <backdrop
        texture="assets/img2/stats_bar3"
        position={[topLeft(), bottomRight()]}
      />
      <MediumText
        text="Character"
        position={top({ y: -52 })}
      />
      <container
        position={[topLeft({ y: -110, x: 30 }), bottomRight({ y: 20, x: -30 })]}
      >
        <Row
          name="Class"
          value={heroTypeMap[hero.unit.typeId].name}
          first
        />
        <Row name="Level" value={hero.level.toString()} />
        <Row
          name="Experience"
          value={Math.round(hero.experience).toString()}
        />
        <Row
          name="Unassigned stat points"
          value={hero.unasignedStatPoints.toString()}
        />

        <Row
          name="Strength"
          value={hero.strength.toString()}
          canIncrement={hero.unasignedStatPoints > 0}
          onIncrement={() => incStat(hero, "strength")}
          header
        />
        <Row
          visible={!!primary}
          name={`Damage (${primary ? primary.name : ""})`}
          value={primary?.damage ? damageRangeToString(primary.damage) : ""}
        />
        <Row
          visible={!!secondary}
          name={`Damage (${secondary ? secondary.name : ""})`}
          value={secondary?.damage ? damageRangeToString(secondary.damage) : ""}
        />

        <Row
          name="Dexterity"
          value={hero.dexterity.toString()}
          canIncrement={hero.unasignedStatPoints > 0}
          onIncrement={() => incStat(hero, "dexterity")}
          header
        />
        <Row name="Attack rating (Strike)" value={"95"} />
        <Row name="Attack rating (Jab)" value={"105"} />
        <Row name="Defense" value={"21"} />

        <Row
          name="Vitality"
          value={hero.vitality.toString()}
          canIncrement={hero.unasignedStatPoints > 0}
          onIncrement={() => incStat(hero, "vitality")}
          header
        />
        <Row
          name="Stamina"
          value={`${
            Math.round(hero.stamina).toString()
          }/${hero.maxStamina.toString()}`}
        />
        <Row
          name="Health"
          value={`${
            Math.round(
              hero.health,
            ).toString()
          }/${hero.maxHealth.toString()}`}
        />

        <Row
          name="Energy"
          value={hero.energy.toString()}
          canIncrement={hero.unasignedStatPoints > 0}
          onIncrement={() => incStat(hero, "energy")}
          header
        />
        <Row
          name="Mana"
          value={`${
            Math.round(
              hero.mana,
            ).toString()
          }/${hero.maxMana.toString()}`}
        />

        <Row name="Fire resistance" value={"0"} gap />
        <Row name="Cold resistance" value={"0"} />
        <Row name="Lightning resistance" value={"0"} />
        <Row name="Poison resistance" value={"0"} />
      </container>
    </container>
  );
};
