interface PosObj {
	point: framepointtype;
	relative: RelativeFrame;
	relativePoint: framepointtype;
	x?: number | undefined;
	y?: number | undefined;
}

const topLeftBase: Pos = {
	point: FRAMEPOINT_TOPLEFT,
	relative: "parent",
	relativePoint: FRAMEPOINT_TOPLEFT,
};

export const topLeft = (pos: Partial<PosObj> = {}): Pos => ({
	...topLeftBase,
	...pos,
});

const topRightBase: Pos = {
	point: FRAMEPOINT_TOPRIGHT,
	relative: "parent",
	relativePoint: FRAMEPOINT_TOPRIGHT,
};

export const topRight = (pos: Partial<PosObj> = {}): Pos => ({
	...topRightBase,
	...pos,
});

export const top = (pos: Partial<PosObj> = {}): Pos => ({
	point: FRAMEPOINT_TOP,
	relative: "parent",
	relativePoint: FRAMEPOINT_TOP,
	...pos,
});

export const bottomRight = (pos: Partial<PosObj> = {}): Pos => ({
	point: FRAMEPOINT_BOTTOMRIGHT,
	relative: "parent",
	relativePoint: FRAMEPOINT_BOTTOMRIGHT,
	...pos,
});

export const leftToRight = (pos: Partial<PosObj> = {}): Pos => ({
	point: FRAMEPOINT_TOPLEFT,
	relative: "previous",
	relativePoint: FRAMEPOINT_TOPRIGHT,
	...pos,
});

export const topDown = (pos: Partial<PosObj> = {}): Pos => ({
	point: FRAMEPOINT_TOPLEFT,
	relative: "previous",
	relativePoint: FRAMEPOINT_BOTTOMLEFT,
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
		top:
			typeof padding === "number"
				? padding
				: padding.top ?? padding.vertical ?? 0,
		bottom:
			typeof padding === "number"
				? padding
				: padding.bottom ?? padding.vertical ?? 0,
		left:
			typeof padding === "number"
				? padding
				: padding.left ?? padding.horizontal ?? 0,
		right:
			typeof padding === "number"
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
