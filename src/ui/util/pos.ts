import { Pos, RelativeFrame } from "w3ts-jsx";

interface PosObj {
  point: framepointtype;
  relative: RelativeFrame;
  relativePoint: framepointtype;
  x?: number | undefined;
  y?: number | undefined;
}
export const topLeft = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_TOPLEFT,
  relative: "parent",
  relativePoint: FRAMEPOINT_TOPLEFT,
  ...pos,
});

export const topRight = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_TOPRIGHT,
  relative: "parent",
  relativePoint: FRAMEPOINT_TOPRIGHT,
  ...pos,
});

export const top = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_TOP,
  relative: "parent",
  relativePoint: FRAMEPOINT_TOP,
  ...pos,
});

export const right = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_RIGHT,
  relative: "parent",
  relativePoint: FRAMEPOINT_RIGHT,
  ...pos,
});

export const bottomLeft = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_BOTTOMLEFT,
  relative: "parent",
  relativePoint: FRAMEPOINT_BOTTOMLEFT,
  ...pos,
});

export const bottomRight = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_BOTTOMRIGHT,
  relative: "parent",
  relativePoint: FRAMEPOINT_BOTTOMRIGHT,
  ...pos,
});

const LEFT_TO_RIGHT_POINT = {
  top: FRAMEPOINT_TOPLEFT,
  center: FRAMEPOINT_LEFT,
  bottom: FRAMEPOINT_BOTTOMLEFT,
};
const LEFT_TO_RIGHT_RELATIVE_POINT = {
  top: FRAMEPOINT_TOPRIGHT,
  center: FRAMEPOINT_RIGHT,
  bottom: FRAMEPOINT_BOTTOMRIGHT,
};
export const leftToRight = (
  pos: Partial<PosObj> = {},
  align: "top" | "bottom" | "center" = "top",
): Pos => ({
  point: LEFT_TO_RIGHT_POINT[align],
  relative: "previous",
  relativePoint: LEFT_TO_RIGHT_RELATIVE_POINT[align],
  ...pos,
});

export const rightToLeft = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_TOPRIGHT,
  relative: "previous",
  relativePoint: FRAMEPOINT_TOPLEFT,
  ...pos,
});

export const topDown = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_TOPLEFT,
  relative: "previous",
  relativePoint: FRAMEPOINT_BOTTOMLEFT,
  ...pos,
});

export const above = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_BOTTOM,
  relative: "parent",
  relativePoint: FRAMEPOINT_TOP,
  ...pos,
});

type Padding =
  | number
  | {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    vertical?: number;
    horizontal?: number;
  };

export const parent = ({
  relative = "parent",
  padding = 0,
}: {
  relative?: PosObj["relative"];
  padding?: Padding;
} = {}): Pos[] => {
  const normalizedPadding = {
    top: typeof padding === "number"
      ? padding
      : padding.top ?? padding.vertical ?? 0,
    bottom: typeof padding === "number"
      ? padding
      : padding.bottom ?? padding.vertical ?? 0,
    left: typeof padding === "number"
      ? padding
      : padding.left ?? padding.horizontal ?? 0,
    right: typeof padding === "number"
      ? padding
      : padding.right ?? padding.horizontal ?? 0,
  };

  return [
    topLeft({
      relative,
      x: normalizedPadding.left,
      y: -normalizedPadding.top,
    }),
    bottomRight({
      relative,
      x: -normalizedPadding.right,
      y: normalizedPadding.bottom,
    }),
  ];
};

export const center = (pos: Partial<PosObj> = {}): Pos => ({
  point: FRAMEPOINT_CENTER,
  relative: "parent",
  relativePoint: FRAMEPOINT_CENTER,
  ...pos,
});
