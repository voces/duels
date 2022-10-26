import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "w3ts-jsx";
import { SkillId, skillMap } from "../../../skills/map";
import { heroKeys, HeroType, heroTypeIds } from "../../../units/heroTypes";
import { repeat } from "../../../util/repeat";
import { MediumText, SmallText } from "../../components/Text";
import { Tooltip } from "../../components/Tooltip";
import { useGlobalState } from "../../hooks/useGlobalState";
import { useHero } from "../../hooks/useHero";
import {
  bottomRight,
  rightToLeft,
  top,
  topLeft,
  topRight,
} from "../../util/pos";

type TreeSkill = false | SkillId | [SkillId, SkillId | SkillId[]];
type TreeRow = [TreeSkill, TreeSkill, TreeSkill];
type Tree = [TreeRow, TreeRow, TreeRow, TreeRow, TreeRow, TreeRow];

const trees: Record<
  HeroType,
  Record<string, Tree>
> = {
  amazon: {},
  assassin: {},
  necromancer: {},
  barbarian: {},
  paladin: {},
  sorceress: {
    "Fire spells": [
      [false, "fireBolt", "warmth"],
      ["inferno", false, false],
      [["blaze", "inferno"], ["fireBall", "fireBolt"], false],
      [["fireWall", "blaze"], false, ["enchant", "warmth"]],
      [false, ["meteor", ["fireWall", "fireBall"]], false],
      [false, "fireMastery", ["hydra", "enchant"]],
    ],
    "Cold spells": [
      [false, "iceBolt", "frozenArmor"],
      ["frostNova", ["iceBlast", "iceBolt"], false],
      [false, false, ["shiverArmor", ["iceBlast", "frozenArmor"]]],
      [false, ["glacialSpike", "iceBlast"], false],
      [["blizzard", ["frostNova", "glacialSpike"]], false, [
        "chillingArmor",
        "shiverArmor",
      ]],
      [["frozenOrb", "blizzard"], "coldMastery", false],
    ],
    "Lightning spells": [
      [false, "chargedBolt", false],
      ["staticField", false, "telekinesis"],
      [["nova", "staticField"], ["lightning", "chargedBolt"], false],
      [false, ["chainLightning", "lightning"], ["teleport", "telekinesis"]],
      [["thunderstorm", ["nova", "chainLightning"]], false, [
        "energyShield",
        ["chainLightning", "teleport"],
      ]],
      [false, "lightningMastery", false],
    ],
  },
  druid: {},
};

const skillIdFromTreeSkill = (skill: TreeSkill | undefined) =>
  skill ? typeof skill === "string" ? skill : skill[0] : undefined;

const Skill = (
  { column, row, tree }: {
    column: number;
    row: number;
    tree: Tree | undefined;
  },
) => {
  const buttonRef = useRef<framehandle | null>(null);

  const treeSkill = tree?.[row][column];
  const skillId = skillIdFromTreeSkill(treeSkill);

  const hero = useHero(`skill-${skillId}`);
  const skill = skillId
    ? hero?.skills.find((s) => s.id === skillId) ?? skillMap[skillId](hero)
    : undefined;

  const incLevel = useCallback(() => {
    if (
      !skill?.canLevel() ||
      !hero ||
      hero.unassignedSkillPoints === 0
    ) return;

    hero.incSkillLevel(skill.id, 1, false);
    hero.unassignedSkillPoints--;
  }, [skill?.canLevel(), skill && hero?.unasignedStatPoints]);

  const vertDep = Array.isArray(treeSkill)
    ? repeat(row, (i) => i).findIndex((i) =>
      skillIdFromTreeSkill(tree?.[i][column]) === treeSkill[1] ||
      (Array.isArray(treeSkill[1]) &&
        treeSkill[1].includes(skillIdFromTreeSkill(tree?.[i][column])!))
    )
    : -1;

  // Technically a diag dep can be multiple rows removed, but w/e (necro)
  const leftDiagDep = Array.isArray(treeSkill)
    ? Array.isArray(treeSkill[1])
      ? treeSkill[1].includes(
        skillIdFromTreeSkill(tree?.[row - 1][column - 1])!,
      )
      : skillIdFromTreeSkill(tree?.[row - 1][column - 1]) === treeSkill[1]
    : false;
  const rightDiagDep = Array.isArray(treeSkill)
    ? Array.isArray(treeSkill[1])
      ? treeSkill[1].includes(
        skillIdFromTreeSkill(tree?.[row - 1][column + 1])!,
      )
      : skillIdFromTreeSkill(tree?.[row - 1][column + 1]) === treeSkill[1]
    : false;

  return (
    <>
      <backdrop
        position={topLeft({
          x: column * 120 + 45 + 35 - 4.6,
          y: row * -100 - 165 + 21.4 + 43.6 + ((row - vertDep - 1) * 100),
        })}
        size={{ width: 9.2, height: 43.6 + ((row - vertDep - 1) * 100) }}
        texture="assets/img2/arrow_body"
        visible={vertDep !== -1}
      />
      <backdrop
        position={topLeft({
          x: column * 120 + 45 + 35 - 12,
          y: row * -100 - 165 + 21.4,
        })}
        size={{ width: 24, height: 21.4 }}
        texture="assets/img2/arrow_head"
        visible={vertDep !== -1}
      />

      <backdrop
        position={topLeft({
          x: column * 120 + -17,
          y: row * -100 - 115 + 12,
        })}
        size={{ width: 53.2, height: 53.2 }}
        texture="assets/img2/arrow_left_body"
        visible={leftDiagDep}
      />
      <backdrop
        position={topLeft({
          x: column * 120 + 24,
          y: row * -100 - 165 + 21.4,
        })}
        size={{ width: 24.4, height: 24.4 }}
        texture="assets/img2/arrow_left_head"
        visible={leftDiagDep}
      />

      <backdrop
        position={topLeft({
          x: column * 120 - 17 + 142,
          y: row * -100 - 115 + 12,
        })}
        size={{ width: 53.2, height: 53.2 }}
        texture="assets/img2/arrow_right_body"
        visible={rightDiagDep}
      />
      <backdrop
        position={topLeft({
          x: column * 120 + 45 + 68,
          y: row * -100 - 165 + 21.4,
        })}
        size={{ width: 24.4, height: 24.4 }}
        texture="assets/img2/arrow_right_head"
        visible={rightDiagDep}
      />

      <button
        position={topLeft({ x: column * 120 + 45, y: row * -100 - 165 })}
        size={70}
        visible={!!treeSkill}
        ref={buttonRef}
        tooltip={buttonRef.current && (
          <Tooltip visible={!!treeSkill}>
            <text
              text={skill?.longDescription()}
              position={rightToLeft({ relative: buttonRef.current })}
            />
          </Tooltip>
        )}
        onClick={incLevel}
      >
        <backdrop position="parent" texture={skill?.icon} />
        <backdrop
          position="parent"
          texture="textures/black32.blp"
          alpha={((skill?.level.total ?? 0) > 0) ||
              (skill?.canLevel() && ((hero?.unassignedSkillPoints ?? 0) > 0))
            ? 0
            : 200}
        />
        <backdrop
          position="parent"
          texture="assets/img2/icon_frame_corners"
        />
        <SmallText
          text={((skill?.level.total ?? 0) > 0)
            ? skill?.level.total.toString()
            : ""}
          position={bottomRight({ x: -5, y: 5 })}
        />
      </button>
    </>
  );
};

export const SkillTree = () => {
  const visible = useGlobalState((s) => !!s.skillTreeVisible);
  const hero = useHero("skill");
  const [treeName, setTreeName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!hero || treeName) return;
    const heroType = heroKeys[heroTypeIds.indexOf(hero.unit.typeId)];
    const heroTrees = trees[heroType];

    setTreeName(Object.keys(heroTrees)[2]);
  }, [hero, treeName]);

  if (!hero) return null;

  const heroType = heroKeys[heroTypeIds.indexOf(hero.unit.typeId)];
  const heroTrees = trees[heroType];
  const heroTreeNames = Object.keys(heroTrees);
  const tree = treeName ? heroTrees[treeName] : undefined;

  return (
    <container
      size={{ width: 400, height: 800 }}
      absPosition={{ point: FRAMEPOINT_CENTER, x: 1600 / 2, y: 1200 / 2 + 100 }}
      visible={visible}
    >
      <backdrop position="parent" texture="assets/img2/tallwindow" />
      <MediumText text={treeName} position={top({ y: -107 })} />
      <MediumText
        text=">"
        position={topRight({ y: -107, x: -70 })}
        onClick={() =>
          setTreeName(
            heroTreeNames[
              (heroTreeNames.indexOf(treeName!) + 1) % heroTreeNames.length
            ],
          )}
      />
      <MediumText
        text="<"
        position={topLeft({ y: -107, x: 70 })}
        onClick={() =>
          setTreeName(
            heroTreeNames[
              heroTreeNames.indexOf(treeName!) === 0
                ? heroTreeNames.length - 1
                : heroTreeNames.indexOf(treeName!) - 1
            ],
          )}
      />

      {repeat(6, (row) =>
        repeat(
          3,
          (column) => <Skill row={5 - row} column={column} tree={tree} />,
        ))}
    </container>
  );
};
