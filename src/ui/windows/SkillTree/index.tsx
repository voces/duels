import { createElement } from "w3ts-jsx";

export const SkillTree = ({ visible }: { visible: boolean }) => {
  return (
    <container
      size={{ width: 600, height: 800 }}
      absPosition={{ point: FRAMEPOINT_CENTER, x: 1600 / 2, y: 1200 / 2 + 100 }}
      visible={visible}
    >
      <backdrop position="parent" texture="assets/img2/green" />
    </container>
  );
};
