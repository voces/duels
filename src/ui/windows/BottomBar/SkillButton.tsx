import { createElement, useEffect, useRef } from "w3ts-jsx";
import {
  registerCommand,
  unregisterCommand,
} from "../../../input/commands/registry";
import { Shortcut } from "../../../input/commands/types";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { above, parent } from "../../util/pos";

export const SkillButton = (
  { first, shortcut, callback, icon, description }: {
    first?: boolean;
    shortcut?: Shortcut | Shortcut[];
    callback?: (playerId: number) => boolean;
    icon?: string;
    description?: string;
  },
) => {
  const buttonRef = useRefState<framehandle | null>(null);

  useEffect(() => {
    if (
      !shortcut || !callback ||
      (Array.isArray(shortcut) && shortcut.length === 0)
    ) return;

    registerCommand({
      name: "Skill",
      fn: callback,
      shortcuts: Array.isArray(shortcut) ? shortcut : [shortcut],
    });

    return () => unregisterCommand({ fn: callback });
  }, [shortcut, callback]);

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
              position={above({ relative: buttonRef.current, y: 48 })}
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
    </gluebutton>
  );
};
