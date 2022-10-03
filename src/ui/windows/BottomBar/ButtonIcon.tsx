import { createElement } from "w3ts-jsx";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { bottomRight, rightToLeft } from "../../util/pos";
import { ICON_SIZE } from "./constants";

export const ButtonIcon = ({
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
      size={ICON_SIZE}
      ref={buttonRef}
      onClick={onClick}
      tooltip={tooltip && buttonRef.current
        ? (
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
        )
        : null}
    >
      <backdrop texture={icon} position="parent" />
    </button>
  );
};
