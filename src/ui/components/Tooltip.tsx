import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";

const TooltipFrame = ({
	children,
	anchors,
}: {
	children?: React.Children;
	anchors?: Pos[];
}) => (
	<frame name="QuestButtonBaseTemplate" position={anchors}>
		{children}
	</frame>
);

export const Tooltip = ({
	children,
	anchors = [
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
	],
}: {
	children?: React.Node;
	anchors?: Pos[];
}): React.Node => <TooltipFrame anchors={anchors}>{children}</TooltipFrame>;
