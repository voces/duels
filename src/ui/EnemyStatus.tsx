import * as React from "../../node_modules/w3ts-jsx/dist/src/index";
import { StatusBar } from "./components/StatusBar";
import { useMouseTarget } from "./hooks/useMouseTarget";
import { useUnitListener } from "./hooks/useUnitListener";
import { topDown, topLeft, topRight } from "./util/pos";

export const EnemyStatus = (): React.Node => {
	const target = useMouseTarget();
	useUnitListener(target);
	return (
		<container
			absPosition={{
				point: FRAMEPOINT_TOP,
				x: 800,
				y: 1200 - 64,
			}}
			size={{
				width: 200,
				height: 100,
			}}
			visible={!!target}
		>
			<container position={topLeft()} size={{ width: 200, height: 16 }}>
				<text
					text={target ? target.unit.name : ""}
					position={[topLeft(), topRight()]}
				/>
			</container>
			<StatusBar
				position={topDown({ y: -4 })}
				size={{ width: 250, height: 32 }}
				text=""
				value={target ? target.health : 1}
				max={target ? target.maxHealth : 1}
				visible={!!target}
			/>
		</container>
	);
};
