import { createElement } from "w3ts-jsx";

export const SkillButton = ({ first }: { first?: boolean }) => (
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
