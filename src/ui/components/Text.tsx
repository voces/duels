import { createElement, TextProps } from "w3ts-jsx";

export const SmallText = (props: TextProps) => (
  <frame name="SmallText" {...props} />
);

export const DefaultText = (props: TextProps) => (
  <frame name="DefaultText" {...props} />
);

export const MediumText = (props: TextProps) => (
  <frame name="MediumText" {...props} />
);

export const LargeText = (props: TextProps) => (
  <frame name="LargeText" {...props} />
);

export const ExtraLargeText = (props: TextProps) => (
  <frame name="ExtraLargeText" {...props} />
);
