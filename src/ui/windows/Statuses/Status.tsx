import * as React from "w3ts-jsx";

import { UnitEx } from "../../../units/UnitEx";
import { StatusBar } from "../../components/StatusBar";
import { leftToRight, topDown, topLeft } from "../../util/pos";

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
				value={unit.mana}
				max={unit.maxMana}
				barTexture="assets/img/Mp_mini_line"
			/>
		</container>
	</container>
);
