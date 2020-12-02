// spellareaofeffect_basic
import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";

const orbSizes = 200;

export const BottomBar = (): React.Node => (
	<>
		<backdrop
			texture="ReplaceableTextures/Selection/spellareaofeffect512"
			absPosition={{
				point: FRAMEPOINT_CENTER,
				x: 800 - 300,
				y: orbSizes / 2,
			}}
			size={{ width: orbSizes, height: orbSizes }}
			vertexColor={BlzConvertColor(255, 255, 0, 0)}
		/>
		<backdrop
			texture="ReplaceableTextures/Selection/spellareaofeffect_orc"
			absPosition={{
				point: FRAMEPOINT_CENTER,
				x: 800 + 300,
				y: orbSizes / 2,
			}}
			size={{ width: orbSizes, height: orbSizes }}
			vertexColor={BlzConvertColor(255, 255, 0, 0)}
		/>
	</>
);
