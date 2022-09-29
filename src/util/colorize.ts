export const colors = {
  physical: "ffffff",
  fire: "81312D",
  cold: "24206B",
  magic: "24206B",
  lightning: "FDF996",
  poison: "08C106",
  holy: "FF00FF",

  error: "ff0303",

  string: "ce915b",
  number: "dcdc8b",
  boolean: "569cd6",
  white: "ffffff",
  handle: "7ebff1",
};

export type Color = keyof typeof colors;

export const colorize = {} as Record<Color, (v: any) => string>;
Object.entries(colors).forEach(
  (
    [color, code],
  ) => (colorize[color as Color] = (string: any): string =>
    `|cff${code}${string}|r`),
);
