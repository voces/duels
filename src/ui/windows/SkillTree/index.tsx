import { createElement } from "w3ts-jsx";
import { useGlobalState } from "../../hooks/useGlobalState";

export const SkillTree = () => {
  const visible = useGlobalState((s) => !!s.skillTreeVisible);
  return (
    <container
      size={{ width: 600, height: 600 }}
      absPosition={{ point: FRAMEPOINT_CENTER, x: 1600 / 2, y: 1200 / 2 + 100 }}
      visible={visible}
    >
      <backdrop position="parent" texture="assets/img2/skilltree" />
    </container>
  );
};
