import { createElement, Pos, useEffect, useForceUpdate } from "w3ts-jsx";

const TooltipFrame = ({
  children,
  anchors,
  visible = true,
}: {
  children?: JSX.Element;
  anchors?: Pos[];
  visible?: boolean;
}) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    forceUpdate();
  }, [children]);

  return (
    <frame
      name="TooltipTemplate"
      position={anchors}
      visible={visible}
    >
      {children}
    </frame>
  );
};

const defaultAnchors: Pos[] = [
  {
    point: FRAMEPOINT_TOPLEFT,
    relative: "children",
    relativePoint: FRAMEPOINT_TOPLEFT,
    x: -12,
    y: 12,
  },
  {
    point: FRAMEPOINT_BOTTOMRIGHT,
    relative: "children",
    relativePoint: FRAMEPOINT_BOTTOMRIGHT,
    x: 12,
    y: -12,
  },
];

export const Tooltip = ({
  children,
  anchors = defaultAnchors,
  visible = true,
}: {
  children: JSX.Element;
  anchors?: Pos[];
  visible?: boolean;
}) => (
  <TooltipFrame anchors={anchors} visible={visible}>{children}</TooltipFrame>
);
