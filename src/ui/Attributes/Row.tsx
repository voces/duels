import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { WIDTH } from "./shared";

export const Row = ({
	name,
	value,
	canIncrement,
	onIncrement,
	first = false,
	gap = false,
}: {
	name: string;
	value: string;
	canIncrement?: boolean;
	onIncrement?: () => void;
	first?: boolean;
	gap?: boolean;
}): React.Node => (
	<container
		position={
			first
				? {
						point: FRAMEPOINT_TOPLEFT,
						relative: "parent",
						relativePoint: FRAMEPOINT_TOPLEFT,
				  }
				: {
						point: FRAMEPOINT_TOPLEFT,
						relative: "previous",
						relativePoint: FRAMEPOINT_BOTTOMLEFT,
						y: gap ? -8 : 0,
				  }
		}
		size={{ width: WIDTH, height: 20 }}
	>
		<text
			text={name}
			position={{
				point: FRAMEPOINT_TOPLEFT,
				relative: "parent",
				relativePoint: FRAMEPOINT_TOPLEFT,
			}}
		/>
		{canIncrement && (
			<button
				size={{ width: 20, height: 20 }}
				position={{
					point: FRAMEPOINT_TOPLEFT,
					relative: "previous",
					relativePoint: FRAMEPOINT_TOPRIGHT,
					x: 4,
				}}
				onClick={onIncrement}
			>
				<backdrop
					position="parent"
					texture="ReplaceableTextures/PassiveButtons/PASBTNStatUp"
				/>
			</button>
		)}
		<text
			text={value}
			position={{
				point: FRAMEPOINT_TOPRIGHT,
				relative: "parent",
				relativePoint: FRAMEPOINT_TOPRIGHT,
			}}
		/>
	</container>
);
