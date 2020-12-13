import { MapPlayer } from "w3ts";

import { Damage } from "../damage";
import { colorize } from "../util/colorize";
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
 * Calculate the amount of experience to reach a level.
 * @param level Level for which we're calculating the require experience to
 * reach. Starts at 1.
 */
export const levelToExperience = (level: number): number =>
	_levelToExperience(level, 0, 0, 0);

export const experienceToLevel = (experience: number): number => {
	let curLevel = 1;
	let curExpierence = 100;
	let curExpierenceJump = 200;

	while (curExpierence <= experience) {
		curExpierence += curExpierenceJump;
		curExpierenceJump += 100;
		curLevel += 1;
	}

	return curLevel;
};

export class Hero extends UnitEx {
	private _strength!: number;
	private _dexterity!: number;
	private _vitality!: number;
	private _energy!: number;

	private _maxStamina = 0;
	private _stamina = 0;

	healthPerLevel!: number;
	staminaPerLevel!: number;
	manaPerLevel!: number;

	healthPerVitality!: number;
	staminaPerVitality!: number;
	manaPerEnergy!: number;

	private _experience = 0;
	private _unasignedStatPoints = 0;

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
			weapon: { min: { physical: 1 }, max: { physical: 1 } },
			// Use experience instead
			level: -1,
		});

		try {
			// Attribute setters will use these, so set them first
			this.healthPerVitality = healthPerVitality;
			this.staminaPerVitality = staminaPerVitality;
			this.manaPerEnergy = manaPerEnergy;

			// Then attributes, since they modify other stats we'll want to rewrite
			this.strength = strength;
			this.dexterity = dexterity;
			this.vitality = vitality;
			this.energy = energy;

			this.maxHealth = maxHealth;
			this.health = maxHealth;
			this.maxStamina = maxStamina;
			this.stamina = maxStamina;
			this.maxMana = maxMana;
			this.mana = maxMana;

			this.healthPerLevel = healthPerLevel;
			this.staminaPerLevel = staminaPerLevel;
			this.manaPerLevel = manaPerLevel;

			// Disable auto-attack
			this.unit.addType(UNIT_TYPE_PEON);
		} catch (err) {
			print(colorize.error(err));
		}
	}

	get strength(): number {
		return this._strength;
	}
	set strength(value: number) {
		this._strength = value;
		this.emitChange();
	}

	get dexterity(): number {
		return this._dexterity;
	}
	set dexterity(value: number) {
		this._dexterity = value;
		this.emitChange();
	}

	get vitality(): number {
		return this._vitality;
	}
	set vitality(value: number) {
		const oldVitality = this._vitality ?? 0;

		this._vitality = value;

		const diff = this._vitality - oldVitality;

		const healthChange = diff * this.healthPerVitality;
		this.health += healthChange;
		this.maxHealth += healthChange;

		const staminaChange = diff * this.staminaPerVitality;
		this.stamina += staminaChange;
		this.maxStamina += staminaChange;

		this.emitChange();
	}

	get energy(): number {
		return this._energy;
	}
	set energy(value: number) {
		const oldEnergy = this._energy ?? 0;

		this._energy = value;

		const diff = this._energy - oldEnergy;
		const manaChange = diff * this.manaPerEnergy;
		this.mana += manaChange;
		this.maxMana += manaChange;

		this.emitChange();
	}

	get maxStamina(): number {
		return this._maxStamina;
	}
	set maxStamina(value: number) {
		this._maxStamina = value;
		this.emitChange();
	}

	get stamina(): number {
		return this._stamina;
	}
	set stamina(value: number) {
		this._stamina = value;
		this.emitChange();
	}

	get experience(): number {
		return this._experience;
	}
	set experience(value: number) {
		const prevLevel = this.level;
		this._experience = value;
		const nextLevel = this.level;
		const gains = nextLevel - prevLevel;
		if (gains > 0) {
			this.health = this.maxHealth += gains * this.healthPerLevel;
			this.stamina = this.maxStamina += gains * this.staminaPerLevel;
			this.mana = this.maxMana += gains * this.manaPerLevel;
			this.unasignedStatPoints += gains * 5;
		}
		this.emitChange();
	}

	get unasignedStatPoints(): number {
		return this._unasignedStatPoints;
	}
	set unasignedStatPoints(value: number) {
		this._unasignedStatPoints = value;
		this.emitChange();
	}

	damage(target: UnitEx, damage: Damage): void {
		super.damage(target, damage);
		if (target.health > 0) return;

		const rawReward = (target.level * 8 + 15) ** 1.2;
		const levelDiff = Math.abs(target.level - this.level);
		const factor = 1 / Math.exp(Math.max(0, levelDiff - 3) / 4);
		const reward = rawReward * factor;

		this.experience += reward;
	}

	get level(): number {
		if (this._level > 0) return this._level;
		return experienceToLevel(this.experience);
	}
}
