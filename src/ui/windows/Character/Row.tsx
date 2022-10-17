import { createElement } from "w3ts-jsx";
import { SmallText } from "../../components/Text";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import {
  bottomRight,
  leftToRight,
  right,
  topDown,
  topLeft,
  topRight,
} from "../../util/pos";

export const Row = ({
  name,
  value,
  canIncrement = false,
  onIncrement,
  first = false,
  header = false,
  gap = false,
  visible = true,
}: {
  name: string;
  value: string;
  canIncrement?: boolean;
  onIncrement?: () => void;
  first?: boolean;
  header?: boolean;
  gap?: boolean;
  visible?: boolean;
}) => {
  const buttonRef = useRefState<framehandle | null>(null);
  const containerRef = useRefState<framehandle | null>(null);
  return (
    <container
      position={first ? topLeft() : topDown({ y: gap ? -8 : header ? -3 : 0 })}
      size={{ width: 240, height: header ? 34 : 20 }}
      visible={visible}
      ref={containerRef}
    >
      {header && (
        <backdrop
          texture="assets/img2/red_gradient"
          position={[
            topLeft({ x: -8, y: -2 }),
            bottomRight({ x: -24, y: 2 }),
          ]}
          alpha={200}
        />
      )}
      <SmallText text={name} position={topLeft({ y: header ? -10 : 0 })} />
      {header && (
        <button
          size={16}
          position={leftToRight({ x: 4 })}
          onClick={onIncrement}
          visible={canIncrement}
          ref={buttonRef}
          tooltip={containerRef.current && (
            <Tooltip>
              <text
                text={`Increase ${name.toLowerCase()}`}
                position={{
                  point: FRAMEPOINT_LEFT,
                  relative: containerRef.current,
                  relativePoint: FRAMEPOINT_RIGHT,
                  x: 64,
                }}
              />
            </Tooltip>
          )}
        >
          <backdrop
            position="parent"
            texture="ReplaceableTextures/PassiveButtons/PASBTNStatUp.blp"
          />
        </button>
      )}
      <SmallText text={value} position={topRight({ y: header ? -10 : 0 })} />
    </container>
  );
};
