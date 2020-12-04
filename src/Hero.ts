import { MapPlayer } from "../node_modules/w3ts/index";
import { UnitEx } from "./UnitEx";

export const _levelToExperience = (
	level: number,
	prevLevel: number,
	prevExp: number,
	prevExpJump: number,
): number => {
	if (prevLevel === level - 1) return prevExp;
	return _levelToExperience(
		level,
		prevLevel + 1,
		prevExp + prevExpJump + 100,
		prevExpJump + 100,
	);
};

/**
 * Calculate the amount of expierence to reach a level.
 * @param level Level for which we're calculating the require expierence to
 * reach. Starts at 1.
 */
export const levelToExperience = (level: number): number =>
	_levelToExperience(level, 0, 0, 0);

export const expierenceToLevel = (expierence: number): number => {
	let curLevel = 1;
	let curExpierence = 100;
	let curExpierenceJump = 200;

	while (curExpierence <= expierence) {
		curExpierence += curExpierenceJump;
		curExpierenceJump += 100;
		curLevel += 1;
	}

	return curLevel;
};

export class Hero extends UnitEx {
	strength: number;
	dexterity: number;
	vitality: number;
	energy: number;
	maxStamina: number;
	maxMana: number;
	stamina: number;
	mana: number;

	healthPerLevel: number;
	staminaPerLevel: number;
	manaPerLevel: number;

	healthPerVitality: number;
	staminaPerVitality: number;
	manaPerEnergy: number;

	expierence = 0;
	unasignedStatPoints = 0;

	constructor({
		unit,
		owner,
		x,
		y,
		strength,
		dexterity,
		vitality,
		energy,
		maxHealth,
		maxStamina,
		maxMana,
		healthPerLevel,
		staminaPerLevel,
		manaPerLevel,
		healthPerVitality,
		staminaPerVitality,
		manaPerEnergy,
	}: {
		unit: string | number;
		owner: MapPlayer;
		x: number;
		y: number;
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
	}) {
		super({
			unit,
			owner,
			x,
			y,
			maxHealth,
			// Unarmed
			weapon: {
				minimumDamage: { physical: 1 },
				maximumDamage: { physical: 1 },
			},
		});
		this.strength = strength;
		this.dexterity = dexterity;
		this.vitality = vitality;
		this.energy = energy;
		this.maxStamina = maxStamina;
		this.stamina = maxStamina;
		this.maxMana = maxMana;
		this.mana = maxMana;
		this.healthPerLevel = healthPerLevel;
		this.staminaPerLevel = staminaPerLevel;
		this.manaPerLevel = manaPerLevel;
		this.healthPerVitality = healthPerVitality;
		this.staminaPerVitality = staminaPerVitality;
		this.manaPerEnergy = manaPerEnergy;

		// Disable auto-attack
		this.unit.addType(UNIT_TYPE_PEON);
	}

	get level(): number {
		return expierenceToLevel(this.expierence);
	}
}
