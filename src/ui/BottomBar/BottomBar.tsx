// spellareaofeffect_basic
import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { useRefState } from "../hooks/useRefState";
import { Tooltip } from "../Tooltip";
import { leftToRight, topLeft } from "../util/pos";

const ICON_SIZE = 48;

const ButtonIcon = ({
	icon,
	tooltip,
	first = false,
}: {
	icon: string;
	tooltip?: string;
	first?: boolean;
}) => {
	const buttonRef = useRefState<framehandle | null>(null);
	return (
		<button
			position={first ? topLeft() : leftToRight()}
			size={{ width: ICON_SIZE, height: ICON_SIZE }}
			ref={buttonRef}
			tooltip={
				tooltip && (
					<Tooltip>
						<text
							text={tooltip}
							position={{
								point: FRAMEPOINT_BOTTOM,
								relative: buttonRef.current ?? "parent",
								relativePoint: FRAMEPOINT_TOP,
								y: 24,
							}}
						/>
					</Tooltip>
				)
			}
		>
			<backdrop texture={icon} position="parent" />
		</button>
	);
};

export const BottomBar = (): React.Node => (
	<container
		absPosition={{
			point: FRAMEPOINT_TOPLEFT,
			x: 800 + 300,
			y: ICON_SIZE,
		}}
		size={{ height: ICON_SIZE, width: 300 }}
	>
		<ButtonIcon
			icon="assets/img/Player_eq_icon_r"
			tooltip="Character"
			first
		/>
		<ButtonIcon icon="assets/img/Bag2_eq_icon_r" tooltip="Inventory" />
		<backdrop texture="asdf" position="parent" alpha={10} />
	</container>
);
