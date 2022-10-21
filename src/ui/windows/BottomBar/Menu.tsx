import { createElement } from "w3ts-jsx";
import { bottomRight } from "../../util/pos";
import { ButtonIcon } from "./ButtonIcon";
import { ICON_SIZE } from "./constants";

export const Menu = ({
  toggleAttributesVisibile,
  toggleInventoryVisible,
  toggleEquipmentVisible,
  toggleSkillTreeVisible,
}: {
  toggleAttributesVisibile: () => void;
  toggleInventoryVisible: () => void;
  toggleEquipmentVisible: () => void;
  toggleSkillTreeVisible: () => void;
}) => (
  <container
    position={bottomRight({ x: -390, y: 150 })}
    size={{ height: ICON_SIZE, width: 300 }}
  >
    <ButtonIcon
      icon="assets/img2/Bag2_eq_icon_r"
      tooltip="Equipment"
      onClick={toggleEquipmentVisible}
      shortcut="p"
      first
    />
    <ButtonIcon
      icon="assets/img2/Player_eq_icon_r"
      tooltip="Character"
      onClick={toggleAttributesVisibile}
      shortcut="o"
    />
    <ButtonIcon
      icon="assets/img2/Bag2_eq_icon_r"
      tooltip="Inventory"
      onClick={toggleInventoryVisible}
      shortcut="i"
    />
    <ButtonIcon
      icon="assets/img2/Bag2_eq_icon_r"
      tooltip="Skill Tree"
      onClick={toggleSkillTreeVisible}
      shortcut="u"
    />
  </container>
);
