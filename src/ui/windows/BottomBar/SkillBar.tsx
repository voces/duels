import { createElement } from "w3ts-jsx";
import { SkillButton } from "./SkillButton";

export const SkillBar = () => (
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

// const ExperienceBar = ({ hero }: { hero: Hero }) => {
//   useUnitListener(hero);
//   const experienceToCurrentLevel = levelToExperience(hero.level);
//   const experienceToNextLevel = levelToExperience(hero.level + 1);
//   const value = hero.experience - experienceToCurrentLevel;
//   const max = experienceToNextLevel - experienceToCurrentLevel;
//   const containerRef = useRefState<framehandle | null>(null);
//   return (
//     <container
//       absPosition={{ point: FRAMEPOINT_BOTTOMLEFT, x: 400 }}
//       size={{ height: 29, width: 800 }}
//       ref={containerRef}
//       tooltip={containerRef.current && (
//         <Tooltip>
//           <text
//             position={{
//               point: FRAMEPOINT_BOTTOM,
//               relative: containerRef.current,
//               relativePoint: FRAMEPOINT_TOP,
//               y: 24,
//             }}
//             text={`${Math.round(value)}/${
//               Math.round(
//                 max,
//               )
//             } (${Math.round((value / max) * 100)}%)`}
//           />
//         </Tooltip>
//       )}
//     >
//       <container
//         position={parent({
//           padding: { top: 8, horizontal: 40, bottom: 2 },
//         })}
//       >
//         <backdrop texture="textures/black32" position="parent" />
//         <backdrop
//           texture="assets/img/XP_bar_line"
//           position={topLeft()}
//           size={{
//             height: 19,
//             width: 720 * (value / max),
//           }}
//         />
//       </container>
//       <backdrop texture="assets/img/XP_bar" position="parent" />
//     </container>
//   );
// };
