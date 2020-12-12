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

export const parent = (
	{
		relative = "parent",
	}: {
		relative: PosObj["relative"];
	} = { relative: "parent" },
): Pos[] => [topLeft({ relative }), bottomRight({ relative })];

export const center = (pos: Partial<PosObj> = {}): Pos => ({
	point: FRAMEPOINT_CENTER,
	relative: "parent",
	relativePoint: FRAMEPOINT_CENTER,
	...pos,
});
