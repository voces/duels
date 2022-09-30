import { createElement } from "w3ts-jsx";
import { bottomRight } from "../../util/pos";
import { ButtonIcon } from "./ButtonIcon";
import { ICON_SIZE } from "./constants";

export const Menu = ({
  toggleAttributesVisibile,
  toggleInventoryVisible,
}: {
  toggleAttributesVisibile: () => void;
  toggleInventoryVisible: () => void;
}) => (
  <container
    position={bottomRight({ x: -390, y: 150 })}
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
