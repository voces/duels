import { compact } from "basic-pragma/dist/utils/arrays";
import { createElement } from "w3ts-jsx";
import { Shortcut } from "../../../input/commands/types";
import { colorize } from "../../../util/colorize";
import { Tooltip } from "../../components/Tooltip";
import { useShortcut } from "../../hooks/useCommand";
import { useRefState } from "../../hooks/useRefState";
import { above, bottomRight, parent } from "../../util/pos";

const shortcutText = (shortcut?: Shortcut | Shortcut[]) => {
  const mainShortcut = Array.isArray(shortcut) ? shortcut[0] : shortcut;
  if (!mainShortcut) return;

  return colorize.hotkey(
    (Array.isArray(mainShortcut) ? mainShortcut.join("") : mainShortcut)
      .toUpperCase(),
  );
};

export const SkillButton = (
  { first, shortcut, callback, icon, description, name }: {
    first?: boolean;
    shortcut?: Shortcut | Shortcut[];
    callback?: (playerId: number) => boolean;
    icon?: string;
    description?: string;
    name?: string;
  },
) => {
  const buttonRef = useRefState<framehandle | null>(null);

  useShortcut({ name, fn: callback, shortcut, priority: 4 });

  return (
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
      onClick={() => callback?.(GetPlayerId(GetLocalPlayer()!))}
      ref={buttonRef}
      tooltip={buttonRef.current &&
        (
          <Tooltip visible={!!icon && !!description}>
            <text
              text={description}
              position={above({ relative: buttonRef.current, y: 64 })}
            />
          </Tooltip>
        )}
    >
      <backdrop
        position={parent({ padding: 2 })}
        texture={icon}
        visible={!!icon}
      />
      <backdrop
        position="parent"
        texture="assets/img2/Icon_frame2v"
      />
      <text
        position={bottomRight({ padding: 8 })}
        text={shortcutText(shortcut)}
      />
    </gluebutton>
  );
};
