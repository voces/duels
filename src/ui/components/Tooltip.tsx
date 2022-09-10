import { createElement, Pos, useEffect, useForceUpdate } from "w3ts-jsx";

const TooltipFrame = ({
  children,
  anchors,
}: {
  children?: JSX.Element;
  anchors?: Pos[];
}) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    forceUpdate();
  }, [children]);

  return (
    <frame
      name="QuestButtonBaseTemplate"
      position={anchors}
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
    x: -24,
    y: 24,
  },
  {
    point: FRAMEPOINT_BOTTOMRIGHT,
    relative: "children",
    relativePoint: FRAMEPOINT_BOTTOMRIGHT,
    x: 24,
    y: -24,
  },
];

export const Tooltip = ({
  children,
  anchors = defaultAnchors,
}: {
  children: JSX.Element;
  anchors?: Pos[];
}) => <TooltipFrame anchors={anchors}>{children}</TooltipFrame>;
