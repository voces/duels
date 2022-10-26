import { buildIncreaseManaRegen } from "../../../effects/increaseManaRegen";
import { BonusField } from "../../../units/heroTypes";
import { UnitEx } from "../../../units/UnitEx";
import { colorize } from "../../../util/colorize";
import { Skill } from "../../types";

const recoveryRate = (level: number) => 0.18 + 0.12 * level;

const getDescription = (skill: Skill) =>
  [
    "Warmth",
    "",
    "Passive - Increases the rate at which you recover mana",
    "",
    `Current Skill Level: ${skill.level.total}`,
    `Mana Recovery Rate: +${
      Math.round(recoveryRate(skill.level.total) * 100)
    }%`,
  ].join("|n");

const getLongDescription = (skill: Skill) =>
  [
    colorize.poison("Warmth"),
    "Passive - Increases the rate at which you recover mana",
    "",
    ...(skill.level.total > 0
      ? [
        "",
        `Current Skill Level: ${skill.level.total}${
          skill.level.bonus > 0 ? ` (Base: ${skill.level.base})` : ""
        }`,
        `Mana Recovery Rate: +${
          Math.round(recoveryRate(skill.level.total) * 100)
        }%`,
      ]
      : []),
    ...(
      skill.level.total === 0 || skill.canLevel()
        ? [
          "",
          skill.level.total === 0 ? "First Level" : "Next Level",
          `Mana Recovery Rate: +${
            Math.round(recoveryRate(skill.level.total + 1) * 100)
          }%`,
        ]
        : []
    ),
  ].join("|n");

export const warmthSkill = (unit: UnitEx | undefined): Skill => ({
  id: "warmth",
  type: "passive",
  name: "Warmth",
  icon: "ReplaceableTextures/CommandButtons/BTNMarkOfFire.blp",
  description() {
    return getDescription(this);
  },
  longDescription() {
    return getLongDescription(this);
  },
  level: new BonusField(0),
  unit,
  canLevel() {
    return this.level.base < 20 &&
      (this.unit ? this.unit.level >= this.level.base : false);
  },
  effects() {
    return [
      buildIncreaseManaRegen({ percent: recoveryRate(this.level.total) }),
    ];
  },
});
