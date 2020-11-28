export enum Hero {
	Amazon = FourCC("n000"),
	Assassin = FourCC("n001"),
	Necromancer = FourCC("n002"),
	Barbarian = FourCC("n003"),
	Paladin = FourCC("h000"),
	Sorceress = FourCC("h001"),
	Druid = FourCC("n004"),
}

export const heroTypes = [
	Hero.Amazon,
	Hero.Assassin,
	Hero.Necromancer,
	Hero.Barbarian,
	Hero.Paladin,
	Hero.Sorceress,
	Hero.Druid,
];

export const heroNames = [
	"Amazon",
	"Assassin",
	"Necromancer",
	"Barbarian",
	"Paladin",
	"Sorceress",
	"Druid",
];

export const heroNamesMap = {
	[Hero.Amazon]: "Amazon",
	[Hero.Assassin]: "Assassin",
	[Hero.Necromancer]: "Necromancer",
	[Hero.Barbarian]: "Barbarian",
	[Hero.Paladin]: "Paladin",
	[Hero.Sorceress]: "Sorceress",
	[Hero.Druid]: "Druid",
};
