import { createElement } from "w3ts-jsx";
import { setGlobalState } from "../../../states/state";
import { bottomRight } from "../../util/pos";
import { ButtonIcon } from "./ButtonIcon";
import { ICON_SIZE } from "./constants";

export const Menu = () => (
  <container
    position={bottomRight({ x: -390, y: 150 })}
    size={{ height: ICON_SIZE, width: 300 }}
  >
    <ButtonIcon
      icon="assets/img2/Cuirass3_eq_icon_r"
      tooltip="Equipment"
      onClick={() =>
        setGlobalState((s) => ({
          ...s,
          equipmentVisible: !s.equipmentVisible,
        }))}
      shortcut="p"
      first
    />
    <ButtonIcon
      icon="assets/img2/Player_eq_icon_r"
      tooltip="Character"
      onClick={() =>
        setGlobalState((s) => ({
          ...s,
          characterVisible: !s.characterVisible,
        }))}
      shortcut="o"
    />
    <ButtonIcon
      icon="assets/img2/Bag2_eq_icon_r"
      tooltip="Inventory"
      onClick={() =>
        setGlobalState((s) => ({
          ...s,
          inventoryVisible: !s.inventoryVisible,
        }))}
      shortcut="i"
    />
    <ButtonIcon
      icon="assets/img2/skilltreeicon"
      tooltip="Skill Tree"
      onClick={() =>
        setGlobalState((s) => ({
          ...s,
          skillTreeVisible: !s.skillTreeVisible,
        }))}
      shortcut="u"
    />
  </container>
);
