import * as React from "w3ts-jsx";

export const SmallText = (props: TextProps): React.Node => (
	<frame name="SmallText" {...props} />
);

export const DefaultText = (props: TextProps): React.Node => (
	<frame name="DefaultText" {...props} />
);

export const MediumText = (props: TextProps): React.Node => (
	<frame name="MediumText" {...props} />
);

export const LargeText = (props: TextProps): React.Node => (
	<frame name="LargeText" {...props} />
);

export const ExtraLargeText = (props: TextProps): React.Node => (
	<frame name="ExtraLargeText" {...props} />
);
