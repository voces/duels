export const colors = {
	physical: "ffffff",
	fire: "81312D",
	cold: "24206B",
	magic: "24206B",
	lightning: "FDF996",
	poison: "08C106",

	error: "ff0303",
};

export type Color = keyof typeof colors;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const colorize = {} as Record<Color, (v: any) => string>;
Object.entries(colors).forEach(
	([color, code]) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(colorize[color as Color] = (string: any): string =>
			`|cff${code}${string}|r`),
);
