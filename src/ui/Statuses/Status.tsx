import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { UnitEx } from "../../UnitEx";
import { useRefState } from "../hooks/useRefState";
import { SmallText } from "../Text";
import { center, leftToRight, parent, topDown, topLeft } from "../util/pos";

const StatusBar = ({
	barTexture,
	max,
	value,
	...rest
}: ContainerProps & {
	barTexture?: SimpleStatusBarProps["texture"];
	max: number;
	value: number;
}) => {
	const containerRef = useRefState<framehandle | null>(null);
	return (
		<container {...rest} ref={containerRef}>
			<simple-frame
				name="SimpleStatusBar"
				position={parent({
					relative: containerRef.current ?? "parent",
				})}
				size={{ width: 250, height: 32 }}
				value={(value / max) * 100}
				texture={barTexture}
			/>
			<backdrop
				position="parent"
				texture="assets/img/HP_bar_mini_frame"
			/>
			<SmallText
				text={`${value}/${max} (${Math.round((value / max) * 100)})%`}
				position={center()}
			/>
		</container>
	);
};

export const Status = ({
	unit,
	first = false,
}: {
	unit: UnitEx;
	first?: boolean;
}): React.Node => (
	<container
		position={first ? topLeft() : topDown()}
		size={{ width: 350, height: 125 }}
	>
		<container position={topLeft()} size={{ width: 100, height: 100 }}>
			<backdrop
				position={topLeft({ x: 7, y: -7 })}
				texture={BlzGetAbilityIcon(unit.unit.typeId)}
				size={{ width: 86, height: 86 }}
			/>
			<backdrop
				position={topLeft()}
				texture="assets/img/Hero_iconFr"
				size={{ width: 100, height: 100 }}
			/>
		</container>
		<container
			position={leftToRight({ x: 8, y: -4 })}
			size={{ width: 250, height: 100 }}
		>
			<container position={topLeft()} size={{ width: 250, height: 16 }}>
				<text text={unit.unit.name} position={topLeft({ x: 8 })} />
			</container>
			<StatusBar
				position={topDown({ y: -4 })}
				size={{ width: 250, height: 32 }}
				value={unit.health}
				max={unit.maxHealth}
			/>
			<StatusBar
				position={topDown({ y: -4 })}
				size={{ width: 250, height: 32 }}
				value={unit.health}
				max={unit.maxHealth}
				barTexture="assets/img/Mp_mini_line"
			/>
		</container>
	</container>
);
