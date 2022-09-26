import { createElement, Fragment } from "w3ts-jsx";
import { Hero, levelToExperience } from "../../units/Hero";
import { Tooltip } from "../components/Tooltip";
import { useRefState } from "../hooks/useRefState";
import { useUnitListener } from "../hooks/useUnitListener";
import { bottomRight, parent, rightToLeft, topLeft } from "../util/pos";

const ICON_SIZE = 48;

const ButtonIcon = ({
  icon,
  tooltip,
  onClick,
  first = false,
}: {
  icon: string;
  tooltip?: string;
  onClick: () => void;
  first?: boolean;
}) => {
  const buttonRef = useRefState<framehandle | null>(null);
  return (
    <button
      position={first ? bottomRight() : rightToLeft()}
      size={{ width: ICON_SIZE, height: ICON_SIZE }}
      ref={buttonRef}
      onClick={onClick}
      tooltip={tooltip && buttonRef.current && (
        <Tooltip>
          <text
            text={tooltip}
            position={{
              point: FRAMEPOINT_BOTTOM,
              relative: buttonRef.current,
              relativePoint: FRAMEPOINT_TOP,
              y: 24,
            }}
          />
        </Tooltip>
      )}
    >
      <backdrop texture={icon} position="parent" />
    </button>
  );
};

const Menu = ({
  toggleAttributesVisibile,
  toggleInventoryVisible,
}: {
  toggleAttributesVisibile: () => void;
  toggleInventoryVisible: () => void;
}) => (
  <container
    position={{
      point: FRAMEPOINT_BOTTOMRIGHT,
      relative: "parent",
      relativePoint: FRAMEPOINT_BOTTOMRIGHT,
      x: -390,
      y: 150,
    }}
    size={{ height: ICON_SIZE, width: 300 }}
  >
    <ButtonIcon
      icon="assets/img2/Player_eq_icon_r"
      tooltip="Character"
      onClick={toggleAttributesVisibile}
      first
    />
    <ButtonIcon
      icon="assets/img2/Bag2_eq_icon_r"
      tooltip="Inventory"
      onClick={toggleInventoryVisible}
    />
  </container>
);

const ExperienceBar = ({ hero }: { hero: Hero }) => {
  useUnitListener(hero);
  const experienceToCurrentLevel = levelToExperience(hero.level);
  const experienceToNextLevel = levelToExperience(hero.level + 1);
  const value = hero.experience - experienceToCurrentLevel;
  const max = experienceToNextLevel - experienceToCurrentLevel;
  const containerRef = useRefState<framehandle | null>(null);
  return (
    <container
      absPosition={{ point: FRAMEPOINT_BOTTOMLEFT, x: 400 }}
      size={{ height: 29, width: 800 }}
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
          padding: { top: 8, horizontal: 40, bottom: 2 },
        })}
      >
        <backdrop texture="textures/black32" position="parent" />
        <backdrop
          texture="assets/img/XP_bar_line"
          position={topLeft()}
          size={{
            height: 19,
            width: 720 * (value / max),
          }}
        />
      </container>
      <backdrop texture="assets/img/XP_bar" position="parent" />
    </container>
  );
};

const HealthGlobe = ({ hero }: { hero: Hero }) => {
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

const SkillButton = ({ first }: { first?: boolean }) => (
  <gluebutton
    inherits="IconButtonTemplate"
    position={first
      ? {
        point: FRAMEPOINT_BOTTOMLEFT,
        relative: "parent",
        relativePoint: FRAMEPOINT_BOTTOMLEFT,
        x: 8,
        y: 8,
      }
      : {
        point: FRAMEPOINT_BOTTOMLEFT,
        relative: "previous",
        relativePoint: FRAMEPOINT_BOTTOMRIGHT,
      }}
    size={96}
  >
    <backdrop
      position="parent"
      texture="assets/img2/Icon_frame2v"
    />
  </gluebutton>
);

const SkillBar = () => (
  <container
    position={{
      point: FRAMEPOINT_BOTTOMLEFT,
      relative: "previous",
      relativePoint: FRAMEPOINT_BOTTOMRIGHT,
    }}
    size={{ height: 114, width: 880 }}
  >
    <backdrop
      position={{
        point: FRAMEPOINT_BOTTOMLEFT,
        relative: "parent",
        relativePoint: FRAMEPOINT_BOTTOMLEFT,
        y: 92,
      }}
      size={{ height: 55, width: 880 }}
      texture="assets/img2/XP_bar_full"
    />
    <backdrop
      position="parent"
      texture="assets/img2/skill_bar_01_NEED_TO_SHRINK"
    />
    <SkillButton first />
    <SkillButton />
    <SkillButton />
    <SkillButton />
    <SkillButton />
    <SkillButton />
    <SkillButton />
    <SkillButton />
    <SkillButton />
  </container>
);

const ManaGlobe = ({ hero }: { hero: Hero }) => {
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
