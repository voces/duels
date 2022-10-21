import { createElement } from "w3ts-jsx";
import { KeyboardShortcut } from "../../../input/commands/types";
import { colorize } from "../../../util/colorize";
import { Tooltip } from "../../components/Tooltip";
import { useShortcut } from "../../hooks/useCommand";
import { useRefState } from "../../hooks/useRefState";
import { above, bottomRight, rightToLeft } from "../../util/pos";
import { ICON_SIZE } from "./constants";

export const ButtonIcon = ({
  icon,
  tooltip,
  onClick,
  first = false,
  shortcut,
}: {
  icon: string;
  tooltip?: string;
  onClick: (playerId: number) => void;
  first?: boolean;
  shortcut?: KeyboardShortcut;
}) => {
  const buttonRef = useRefState<framehandle | null>(null);

  useShortcut({
    name: tooltip,
    fn: (playerId) => {
      onClick?.(playerId);
      return true;
    },
    shortcut,
    priority: 2,
  });

  return (
    <button
      position={first ? bottomRight() : rightToLeft()}
      size={ICON_SIZE}
      ref={buttonRef}
      onClick={() => onClick(GetPlayerId(GetLocalPlayer()!))}
      tooltip={tooltip && buttonRef.current
        ? (
          <Tooltip>
            <text
              text={`${tooltip}${
                shortcut ? ` (${colorize.hotkey(shortcut.toUpperCase())})` : ""
              }`}
              position={above({ relative: buttonRef.current, y: 12 })}
            />
          </Tooltip>
        )
        : null}
    >
      <backdrop texture={icon} position="parent" />
    </button>
  );
};
