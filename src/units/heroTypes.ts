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

export const heroData: HeroTypeMap<HeroData> = {
	amazon: {
		type: FourCC("n000"),
		name: "Amazon",
		initial: {
			strength: 20,
			dexterity: 25,
			vitality: 20,
			energy: 15,
			maxHealth: 50,
			maxStamina: 84,
			maxMana: 15,
			healthPerLevel: 2,
			staminaPerLevel: 1,
			manaPerLevel: 1.5,
			healthPerVitality: 3,
			staminaPerVitality: 1,
			manaPerEnergy: 1.5,
		},
	},
	assassin: {
		type: FourCC("n001"),
		name: "Assassin",
		initial: {
			strength: 20,
			dexterity: 20,
			vitality: 20,
			energy: 25,
			maxHealth: 50,
			maxStamina: 95,
			maxMana: 25,
			healthPerLevel: 2,
			staminaPerLevel: 1.25,
			manaPerLevel: 1.5,
			healthPerVitality: 3,
			staminaPerVitality: 1.25,
			manaPerEnergy: 1.75,
		},
	},
	necromancer: {
		type: FourCC("n002"),
		name: "Necromancer",
		initial: {
			strength: 15,
			dexterity: 25,
			vitality: 15,
			energy: 25,
			maxHealth: 45,
			maxStamina: 79,
			maxMana: 25,
			healthPerLevel: 1.5,
			staminaPerLevel: 1,
			manaPerLevel: 2,
			healthPerVitality: 2,
			staminaPerVitality: 1,
			manaPerEnergy: 2,
		},
	},
	barbarian: {
		type: FourCC("n003"),
		name: "Barbarian",
		initial: {
			strength: 30,
			dexterity: 20,
			vitality: 25,
			energy: 10,
			maxHealth: 55,
			maxStamina: 92,
			maxMana: 10,
			healthPerLevel: 2,
			staminaPerLevel: 1,
			manaPerLevel: 1,
			healthPerVitality: 4,
			staminaPerVitality: 1,
			manaPerEnergy: 1,
		},
	},
	paladin: {
		type: FourCC("h000"),
		name: "Paladin",
		initial: {
			strength: 25,
			dexterity: 20,
			vitality: 25,
			energy: 15,
			maxHealth: 55,
			maxStamina: 89,
			maxMana: 15,
			healthPerLevel: 2,
			staminaPerLevel: 1,
			manaPerLevel: 1.5,
			healthPerVitality: 3,
			staminaPerVitality: 1,
			manaPerEnergy: 1.5,
		},
	},
	sorceress: {
		type: FourCC("h001"),
		name: "Sorceress",
		initial: {
			strength: 10,
			dexterity: 25,
			vitality: 10,
			energy: 35,
			maxHealth: 40,
			maxStamina: 74,
			maxMana: 35,
			healthPerLevel: 1,
			staminaPerLevel: 1,
			manaPerLevel: 2,
			healthPerVitality: 2,
			staminaPerVitality: 1,
			manaPerEnergy: 2,
		},
	},
	druid: {
		type: FourCC("n004"),
		name: "Druid",
		initial: {
			strength: 15,
			dexterity: 20,
			vitality: 25,
			energy: 20,
			maxHealth: 55,
			maxStamina: 84,
			maxMana: 20,
			healthPerLevel: 1.5,
			staminaPerLevel: 1,
			manaPerLevel: 2,
			healthPerVitality: 2,
			staminaPerVitality: 1,
			manaPerEnergy: 2,
		},
	},
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

export const heroTypeMap = Object.fromEntries(
	heroDataArr.map((h) => [h.type, h]),
);

export const isHeroType = (unit: UnitEx): boolean => {
	const typeId = unit.unit.typeId;
	return heroTypeIds.includes(typeId);
};
