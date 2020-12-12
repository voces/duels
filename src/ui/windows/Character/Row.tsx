import * as React from "../../../../node_modules/w3ts-jsx/dist/src/index";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { bottomRight, topLeft, topRight } from "../../util/pos";
import { WIDTH } from "./shared";

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
}): React.Node => {
	const buttonRef = useRefState<framehandle | null>(null);
	return (
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
			visible={visible}
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
			<button
				size={{ width: 20, height: 20 }}
				position={{
					point: FRAMEPOINT_TOPLEFT,
					relative: "previous",
					relativePoint: FRAMEPOINT_TOPRIGHT,
					x: 4,
				}}
				onClick={onIncrement}
				visible={canIncrement}
				ref={buttonRef}
				tooltip={
					<Tooltip>
						<text
							text={`Increase ${name.toLowerCase()}`}
							position={{
								point: FRAMEPOINT_LEFT,
								relative: buttonRef.current ?? "parent",
								relativePoint: FRAMEPOINT_RIGHT,
								x: 210,
							}}
						/>
					</Tooltip>
				}
			>
				<backdrop
					position="parent"
					texture="ReplaceableTextures/PassiveButtons/PASBTNStatUp"
				/>
			</button>
			<text text={value} position={topRight({ y: header ? -10 : 0 })} />
		</container>
	);
};
