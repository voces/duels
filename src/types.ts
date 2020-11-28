interface HeroTypeMap<T> {
	amazon: T;
	assassin: T;
	necromancer: T;
	barbarian: T;
	paladin: T;
	sorceress: T;
	druid: T;
}

interface HeroData {
	type: number;
	name: string;
}

export const heroData: HeroTypeMap<HeroData> = {
	amazon: { type: FourCC("n000"), name: "Amazon" },
	assassin: { type: FourCC("n001"), name: "Assassin" },
	necromancer: { type: FourCC("n002"), name: "Necromancer" },
	barbarian: { type: FourCC("n003"), name: "Barbarian" },
	paladin: { type: FourCC("h000"), name: "Paladin" },
	sorceress: { type: FourCC("h001"), name: "Sorceress" },
	druid: { type: FourCC("n004"), name: "Druid" },
};

export const heroKeys = [
	"amazon",
	"assassin",
	"necromancer",
	"barbarian",
	"paladin",
	"sorceress",
	"druid",
] as const;

export type Hero = keyof HeroTypeMap<unknown>;

export const heroDataArr: HeroData[] = heroKeys.map((key) => heroData[key]);
