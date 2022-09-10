import { createElement } from "w3ts-jsx";
import { DamageType, damageTypes } from "../../../damage";
import {
  primaryCommands,
  secondaryCommands,
} from "../../../input/commands/registry";
import { Command } from "../../../input/commands/types";
import { Hero } from "../../../units/Hero";
import { heroTypeMap } from "../../../units/heroTypes";
import { colorize } from "../../../util/colorize";
import { LargeText } from "../../components/Text";
import { useUnitListener } from "../../hooks/useUnitListener";
import { Row } from "./Row";
import { WIDTH } from "./shared";

const incStat = (
  hero: Hero,
  stat: "strength" | "dexterity" | "vitality" | "energy",
) => {
  if (hero.unasignedStatPoints <= 0) return;
  hero.unasignedStatPoints--;
  hero["base" + stat[0].toUpperCase() + stat.slice(1)]++;
};

const damageRangeToString = (damage: Command["damage"]) => {
  if (!damage) return "";
  if (typeof damage === "function") damage = damage(0);
  if (!damage) return "";

  let minSum = 0;
  let maxSum = 0;
  let mainDamageType: DamageType = "physical";
  let mainDamageAmount = 0;

  for (const damageType of damageTypes) {
    const minDamage = damage.min[damageType];
    if (minDamage) minSum += minDamage;

    const maxDamage = damage.max[damageType];
    if (maxDamage) {
      maxSum += maxDamage;
      if (maxDamage > mainDamageAmount) {
        mainDamageType = damageType;
        mainDamageAmount = maxDamage;
      }
    }
  }

  return colorize[mainDamageType](`${minSum}-${maxSum}`);
};

export const Character = ({
  hero,
  visible,
}: {
  hero: Hero;
  visible: boolean;
}) => {
  useUnitListener(hero);
  const primary = primaryCommands[hero.owner.id];
  const secondary = secondaryCommands[hero.owner.id];
  return (
    <container
      size={{ width: WIDTH, height: WIDTH * 2 }}
      absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 48, y: 1200 - 350 }}
      visible={visible}
    >
      <backdrop
        texture="assets/img/stats_bar3"
        position={[
          {
            point: FRAMEPOINT_BOTTOMLEFT,
            relative: "parent",
            relativePoint: FRAMEPOINT_BOTTOMLEFT,
            x: -48,
            y: -48,
          },
          {
            point: FRAMEPOINT_TOPRIGHT,
            relative: "parent",
            relativePoint: FRAMEPOINT_TOPRIGHT,
            x: 48,
            y: 154,
          },
        ]}
      />
      <LargeText
        text="Character"
        position={{
          point: FRAMEPOINT_TOP,
          relative: "parent",
          relativePoint: FRAMEPOINT_TOP,
          y: 80,
        }}
      />
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
        name={`Attack damage (${primary ? primary.name : ""})`}
        value={primary?.damage ? damageRangeToString(primary.damage) : ""}
      />
      <Row
        visible={!!secondary}
        name={`Attack damage (${secondary ? secondary.name : ""})`}
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
        value={`${hero.stamina.toString()}/${hero.maxStamina.toString()}`}
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
  );
};
