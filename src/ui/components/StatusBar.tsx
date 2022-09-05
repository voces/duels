import { createElement } from "w3ts-jsx";
import { ContainerProps, SimpleStatusBarProps } from "w3ts-jsx";
import { SmallText } from "../components/Text";
import { center, topLeft } from "../util/pos";

export const StatusBar = ({
  barTexture,
  max,
  value,
  text,
  size: { width = 250, height = 32 } = {},
  ...rest
}: ContainerProps & {
  barTexture: SimpleStatusBarProps["texture"];
  max: number;
  value: number;
  text?: string;
  size?: { width?: number; height?: number };
}) => (
  <container size={{ width, height }} {...rest}>
    <backdrop position="parent" texture="assets/img/black_status_line" />
    <backdrop
      texture={barTexture}
      position={topLeft()}
      size={{ height, width: width * (value / max) }}
    />
    <backdrop position="parent" texture="assets/img/HP_bar_mini_frame" />
    <SmallText
      text={text ??
        `${Math.round(value)}/${max} (${
          Math.round(
            (value / max) * 100,
          )
        }%)`}
      position={center()}
    />
  </container>
);
