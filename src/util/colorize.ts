export const colors = {
	fire: "81312D",
	cold: "24206B",
	magic: "24206B",
	lightning: "FDF996",
	poison: "08C106",
};

export const colorize = {
	physical: (s: unknown): string => `${s}`,
	fire: (s: unknown): string => `|cff${colors.fire}${s}|r`,
	cold: (s: unknown): string => `|cff${colors.cold}${s}|r`,
	magic: (s: unknown): string => `|cff${colors.magic}${s}|r`,
	lightning: (s: unknown): string => `|cff${colors.lightning}${s}|r`,
	poison: (s: unknown): string => `|cff${colors.poison}${s}|r`,
};
