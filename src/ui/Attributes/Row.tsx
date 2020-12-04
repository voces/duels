import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { bottomRight, topLeft, topRight } from "../util/pos";
import { WIDTH } from "./shared";

export const Row = ({
	name,
	value,
	canIncrement,
	onIncrement,
	first = false,
	header = false,
	gap = false,
}: {
	name: string;
	value: string;
	canIncrement?: boolean;
	onIncrement?: () => void;
	first?: boolean;
	header?: boolean;
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
						y: header || gap ? -8 : 0,
				  }
		}
		size={{ width: WIDTH, height: header ? 40 : 20 }}
	>
		{header && (
			<backdrop
				texture="assets/img/red_gradient"
				position={[
					topLeft({ x: -16, y: -2 }),
					bottomRight({ x: -48, y: 2 }),
				]}
				alpha={200}
			/>
		)}
		<text text={name} position={topLeft({ y: header ? -10 : 0 })} />
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
		<text text={value} position={topRight({ y: header ? -10 : 0 })} />
	</container>
);
