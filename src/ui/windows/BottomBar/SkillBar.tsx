import { createElement, useEffect, useState } from "w3ts-jsx";
import { queueAction } from "../../../actions/queue";
import {
  bottomLeft,
  bottomRight,
  leftToRight,
  parent,
  topLeft,
} from "../../util/pos";
import { SkillButton } from "./SkillButton";
import { Skill } from "../../../skills/types";
import { useHero } from "../../hooks/useHero";
import { levelToExperience } from "../../../units/Hero";
import { useRefState } from "../../hooks/useRefState";
import { Tooltip } from "../../components/Tooltip";

export const SkillBar = () => {
  const hero = useHero("skill");
  const [bindings, setBindings] = useState<
    ({ skill?: Skill; fn: (playerId: number) => boolean } | undefined)[]
  >(
    [],
  );

  useEffect(() => {
    if (!hero) return;
    let mutated = false;
    const newBindings = [...bindings];

    // Remove skills that no longer exist
    for (let i = 0; i < 9; i++) {
      const skill = newBindings[i]?.skill;
      if (skill && !hero.skills.includes(skill)) {
        newBindings[i] = undefined;
        mutated = true;
      }
    }

    // Add skills to empty bindings
    let n = 0;
    for (let i = 0; i < 9; i++) {
      if (bindings[i]) continue;
      for (; n < hero.skills.length; n++) {
        const skill = hero.skills[n];
        if (newBindings.some((b) => b?.skill === skill)) continue;
        newBindings[i] = {
          skill,
          fn: (playerId: number) => {
            if (!skill.validate(playerId)) return false;
            queueAction(playerId, {
              perform: (done) => skill.onUse(playerId, done),
              interruptable: false,
            });
            return true;
          },
        };
        mutated = true;
        break;
      }
    }
    if (mutated) setBindings(newBindings);
  }, [hero?.skills.map((s) => s.id).join("|")]);

  const propsFromBinding = (binding: number) => ({
    callback: bindings[binding]?.fn,
    icon: bindings[binding]?.skill?.icon,
    name: bindings[binding]?.skill?.name,
    description: bindings[binding]?.skill?.description,
  });

  return (
    <container
      position={leftToRight(undefined, "bottom")}
      size={{ height: 114, width: 880 }}
    >
      <ExperienceBar />
      <backdrop
        position="parent"
        texture="assets/img2/skill_bar_01_NEED_TO_SHRINK"
      />
      <SkillButton
        shortcut={[["q"], ["left", "shift"]]}
        {...propsFromBinding(0)}
        first
      />
      <SkillButton
        shortcut={[["w"], ["right"]]}
        {...propsFromBinding(1)}
      />
      <SkillButton shortcut="e" {...propsFromBinding(2)} />
      <SkillButton shortcut="r" {...propsFromBinding(3)} />
      <SkillButton shortcut="t" {...propsFromBinding(4)} />
      <SkillButton shortcut="a" {...propsFromBinding(5)} />
      <SkillButton shortcut="s" {...propsFromBinding(6)} />
      <SkillButton shortcut="d" {...propsFromBinding(7)} />
      <SkillButton shortcut="f" {...propsFromBinding(8)} />
    </container>
  );
};

const ExperienceBar = () => {
  const hero = useHero("experience");
  const containerRef = useRefState<framehandle | null>(null);

  if (!hero) return null;

  const experienceToCurrentLevel = levelToExperience(hero.level);
  const experienceToNextLevel = levelToExperience(hero.level + 1);
  const value = hero.experience - experienceToCurrentLevel;
  const max = experienceToNextLevel - experienceToCurrentLevel;

  return (
    <container
      position={bottomLeft({ y: 92 })}
      size={{ height: 55, width: 880 }}
      ref={containerRef}
      tooltip={containerRef.current && (
        <Tooltip>
          <text
            position={{
              point: FRAMEPOINT_BOTTOM,
              relative: containerRef.current,
              relativePoint: FRAMEPOINT_TOP,
              y: 24,
            }}
            text={`${Math.round(value)}/${
              Math.round(
                max,
              )
            } (${Math.round((value / max) * 100)}%)`}
          />
        </Tooltip>
      )}
    >
      <container
        position={parent({
          padding: { top: 8, horizontal: 50, bottom: 20 },
        })}
      >
        <backdrop
          texture="ui/widgets/tooltips/human/human-tooltip-background.blp"
          position="parent"
        />
        <backdrop
          texture="assets/img2/XP_bar_line"
          position={[topLeft(), bottomRight({ x: -780 * (1 - (value / max)) })]}
        />
      </container>
      <backdrop texture="assets/img2/XP_bar" position="parent" />
    </container>
  );
};
