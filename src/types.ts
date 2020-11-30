import { UnitEx } from "./UnitEx";

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
	initial: {
		strength: number;
		dexterity: number;
		vitality: number;
		energy: number;
		maxHealth: number;
		maxStamina: number;
		maxMana: number;
		healthPerLevel: number;
		staminaPerLevel: number;
		manaPerLevel: number;
		healthPerVitality: number;
		staminaPerVitality: number;
		manaPerEnergy: number;
	};
}

const initial = {
	strength: 1,
	dexterity: 1,
	vitality: 1,
	energy: 1,
	maxHealth: 50,
	maxStamina: 1,
	maxMana: 1,
	healthPerLevel: 1,
	staminaPerLevel: 1,
	manaPerLevel: 1,
	healthPerVitality: 1,
	staminaPerVitality: 1,
	manaPerEnergy: 1,
};

export const heroData: HeroTypeMap<HeroData> = {
	amazon: { type: FourCC("n000"), name: "Amazon", initial },
	assassin: { type: FourCC("n001"), name: "Assassin", initial },
	necromancer: { type: FourCC("n002"), name: "Necromancer", initial },
	barbarian: { type: FourCC("n003"), name: "Barbarian", initial },
	paladin: { type: FourCC("h000"), name: "Paladin", initial },
	sorceress: { type: FourCC("h001"), name: "Sorceress", initial },
	druid: { type: FourCC("n004"), name: "Druid", initial },
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

export type HeroType = keyof HeroTypeMap<unknown>;

export const heroDataArr: HeroData[] = heroKeys.map((key) => heroData[key]);

export const heroTypeIds = heroDataArr.map((h) => h.type);

export const isHeroType = (unit: UnitEx): boolean => {
	const typeId = unit.unit.typeId;
	return heroTypeIds.includes(typeId);
};
