import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { UnitEx } from "../../UnitEx";
import { useRefState } from "../hooks/useRefState";
import { leftToRight, topDown, topLeft } from "../util/pos";

export const Status = ({
	unit,
	count = 1,
	first = false,
}: {
	unit: UnitEx;
	count?: number;
	first?: boolean;
}): React.Node => {
	const unitNameRef = useRefState<framehandle | null>(null);
	const healthRef = useRefState<framehandle | null>(null);
	return (
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
				position={leftToRight({ x: 8, y: -2 })}
				size={{ width: 250, height: 100 }}
			>
				<text
					text={unit.unit.name}
					position={topLeft()}
					ref={unitNameRef}
				/>
				<simple-frame
					name="MyBarEx"
					position={topDown({
						relative: unitNameRef.current ?? "parent",
						y: -4,
					})}
					size={{ width: 250, height: 32 }}
					ref={healthRef}
					value={(unit.health / unit.maxHealth) * 100}
				/>
				<simple-frame
					name="MyBarEx"
					position={topDown({
						relative: healthRef.current ?? "parent",
						y: -4,
					})}
					texture="Replaceabletextures/Teamcolor/Teamcolor01"
					size={{ width: 250, height: 32 }}
				/>
			</container>
		</container>
	);
};
