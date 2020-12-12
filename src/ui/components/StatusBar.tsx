import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { useRefState } from "../hooks/useRefState";
import { SmallText } from "../Text";
import { center, parent } from "../util/pos";

export const StatusBar = ({
	barTexture,
	max,
	value,
	text,
	visible,
	...rest
}: ContainerProps & {
	barTexture?: SimpleStatusBarProps["texture"];
	max: number;
	value: number;
	text?: string;
}): React.Node => {
	const containerRef = useRefState<framehandle | null>(null);
	return (
		<container ref={containerRef} visible={visible} {...rest}>
			<simple-frame
				name="SimpleStatusBar"
				position={parent({
					relative: containerRef.current ?? "parent",
				})}
				size={{ width: 250, height: 32 }}
				value={(value / max) * 100}
				texture={barTexture}
				visible={visible}
			/>
			<backdrop
				position="parent"
				texture="assets/img/HP_bar_mini_frame"
			/>
			<SmallText
				text={
					text ??
					`${Math.round(value)}/${max} (${Math.round(
						(value / max) * 100,
					)}%)`
				}
				position={center()}
			/>
		</container>
	);
};
