import { Effect, MapPlayer } from "@voces/w3ts";
import { compact } from "basic-pragma/dist/utils/arrays";

import type { Damage } from "../damage";
import { equipItem, unequipItem } from "../items/equipping";
import type { Item } from "../items/Item";
import { startTimeout, times } from "../util";
import { colorize } from "../util/colorize";
import { BonusField } from "./heroTypes";
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

interface Items {
  mainHand?: Item;
  offHand?: Item;
  head?: Item;
  boots?: Item;
  armor?: Item;
  belt?: Item;
  amulet?: Item;
  mainRing?: Item;
  offRing?: Item;
  gloves?: Item;
  // TODO: maybe use Set instead?
  inventory: Item[];
}

type UnitItemSlot = Exclude<keyof Items, "inventory">;

const unitItemSlots: UnitItemSlot[] = ["mainHand", "offHand", "head"];

export class Hero extends UnitEx {
  private _strength = new BonusField<number>(0);
  private _dexterity = new BonusField<number>(0);
  private _vitality = new BonusField<number>(0);
  private _energy = new BonusField<number>(0);

  private _maxStamina = new BonusField<number>(0);
  private _stamina = 0;

  healthPerLevel!: number;
  staminaPerLevel!: number;
  manaPerLevel!: number;

  healthPerVitality!: number;
  staminaPerVitality!: number;
  manaPerEnergy!: number;

  private _experience = 0;
  private _unasignedStatPoints = 0;
  private _unassignedSkillPoints = 0;

  private items: Items = { inventory: [] };

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
      this.baseStrength = strength;
      this.baseDexterity = dexterity;
      this.baseVitality = vitality;
      this.baseEnergy = energy;

      this.maxBaseMana = maxMana;
      this.maxBaseStamina = maxStamina;

      this.healthPerLevel = healthPerLevel;
      this.staminaPerLevel = staminaPerLevel;
      this.manaPerLevel = manaPerLevel;

      // Disable auto-attack
      this.unit.addType(UNIT_TYPE_PEON);
    } catch (err) {
      console.error(colorize.error(err));
    }
  }

  get strength(): number {
    return this._strength.total;
  }
  get baseStrength() {
    return this._strength.base;
  }
  set baseStrength(value: number) {
    this._strength.base = value;
    this.emitChange("strength");
  }

  get dexterity(): number {
    return this._dexterity.total;
  }
  get baseDexterity() {
    return this._dexterity.base;
  }
  set baseDexterity(value: number) {
    this._dexterity.base = value;
    this.emitChange("dexterity");
  }

  get vitality(): number {
    return this._vitality.total;
  }
  get baseVitality() {
    return this._vitality.base;
  }
  set baseVitality(value: number) {
    const oldVitality = this._vitality.base ?? 0;

    this._vitality.base = value;

    const diff = this._vitality.base - oldVitality;

    const healthChange = diff * this.healthPerVitality;
    this.maxBaseHealth += healthChange;

    const staminaChange = diff * this.staminaPerVitality;
    this.maxBaseStamina += staminaChange;

    this.emitChange("vitality");
  }

  get energy(): number {
    return this._energy.total;
  }
  get baseEnergy() {
    return this._energy.base;
  }
  set baseEnergy(value: number) {
    const manaChange = (value - this._energy.base) * this.manaPerEnergy;

    this._energy.base = value;
    this.maxBaseMana += manaChange;

    this.emitChange("energy");
  }

  get stamina(): number {
    return this._stamina;
  }
  set stamina(value: number) {
    this._stamina = value;
    this.emitChange("stamina");
  }

  get maxStamina(): number {
    return this._maxStamina.total;
  }
  get maxBaseStamina(): number {
    return this._maxStamina.base;
  }
  set maxBaseStamina(value: number) {
    const curStaminaPercent = this._maxStamina.total === 0
      ? 1
      : this._stamina / this._maxStamina.total;
    const staminaChange = (value - this._maxStamina.base) * curStaminaPercent;
    this._maxStamina.base = value;
    this._stamina += staminaChange;
    this.emitChange("stamina");
  }
  get maxBonusStamina(): number {
    return this._maxStamina.bonus;
  }
  set maxBonusStamina(value: number) {
    const curStaminaPercent = this._maxStamina.total === 0
      ? 1
      : this._stamina / this._maxStamina.total;
    const staminaChange = (value - this._maxStamina.bonus) * curStaminaPercent;
    this._maxStamina.bonus = value;
    this._stamina += staminaChange;
    this.emitChange("stamina");
  }

  get experience(): number {
    return this._experience;
  }
  set experience(value: number) {
    const prevLevel = this.level;
    this._experience = value;
    const nextLevel = this.level;
    const levelGains = nextLevel - prevLevel;
    if (levelGains > 0) {
      this.health = this.maxBaseHealth += levelGains * this.healthPerLevel;
      this.stamina = this.maxBaseStamina += levelGains * this.staminaPerLevel;
      this.mana = this.maxBaseMana += levelGains * this.manaPerLevel;
      this.unasignedStatPoints += levelGains * 5;
      this.unassignedSkillPoints += levelGains;
      const e = new Effect(
        "Abilities\\Spells\\Other\\Levelup\\LevelupCaster.mdl",
        this.x,
        this.y,
      );
      startTimeout(5, () => e.destroy());
    }
    this.emitChange("experience");
  }

  get unasignedStatPoints(): number {
    return this._unasignedStatPoints;
  }
  set unasignedStatPoints(value: number) {
    this._unasignedStatPoints = value;
    this.emitChange("stats");
  }

  get unassignedSkillPoints() {
    return this._unassignedSkillPoints;
  }
  set unassignedSkillPoints(value: number) {
    this._unassignedSkillPoints = value;
    this.emitChange("skillpoints");
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

  removeItemFromInventory(item: Item): boolean {
    const index = this.items.inventory.indexOf(item);
    if (index === -1) return false;

    this.items.inventory.splice(index, 1);
    this.emitChange("inventory");
    return true;
  }

  addItemToInventory(item: Item): boolean {
    const slot = this.items.inventory.find((i) => i === item);
    if (slot) return false;

    if (typeof item.stacks === "number") {
      const existingStack = this.items.inventory.find((i) =>
        i.name === item.name
      );
      if (existingStack) {
        existingStack.stacks = (existingStack.stacks ?? 1) + (item.stacks ?? 1);
        return true;
      }
    }

    this.items.inventory.push(item);
    this.emitChange("inventory");
    return true;
  }

  unequip(item: Item): boolean {
    const equippedSlot = unitItemSlots.find((s) => this.items[s] === item);
    if (!equippedSlot) return false;

    if (!this.addItemToInventory(item)) return false;

    this.items[equippedSlot] = undefined;
    unequipItem(item, this);

    this.emitChange("equipment", `equipment-${equippedSlot}`);

    return true;
  }

  equip(item: Item): boolean {
    if (item.slot === "potion") return false;

    const unequipSlots: UnitItemSlot[] = item.slot === "hands"
      ? ["mainHand", "offHand"]
      : [item.slot];
    const equipSlot = item.slot === "hands" ? "mainHand" : item.slot;

    // Don't check if it succeeds, as we can equip directly
    this.removeItemFromInventory(item);

    // Unequip slots (and move to inventory)
    compact(unequipSlots
      .map((s) => this.items[s]))
      .forEach((item) => this.unequip(item));

    this.items[equipSlot] = item;
    equipItem(item, this);

    this.emitChange("equipment", `equipment-${equipSlot}`);

    return true;
  }

  get inventory(): ReadonlyArray<Item> {
    return this.items.inventory;
  }

  get equipment(): Readonly<Omit<Items, "inventory">> {
    return this.items;
  }
}
