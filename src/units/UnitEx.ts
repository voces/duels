import { getElapsedTime, MapPlayer, TextTag, Unit } from "@voces/w3ts";

import { queueAction } from "../actions/queue";
import type { Damage, DamageType, Weapon, WeaponInput } from "../damage";
import { damageTypes, randomDamage, withDamageSystemOff } from "../damage";
import { registerCommand } from "../input/commands/registry";
import type { SkillName } from "../skills/map";
import { skillMap } from "../skills/map";
import type { Skill } from "../skills/types";
import { dummyGroup } from "../util";
import { colorize } from "../util/colorize";
import { formatNumber } from "../util/formatNumber";
import type { Vector2 } from "../util/Vector2";
import { Vector2Ex } from "../util/Vector2";
import { BonusField } from "./heroTypes";

const map = new Map<unit, UnitEx>();

export interface UnitExProps {
  unit: number | string;
  owner: MapPlayer | number;
  x: number;
  y: number;
  facing?: number;
  maxHealth?: number;
  weapon?: WeaponInput;
  resistances?: Damage;
  defense?: number;
  level: number;
}

export class UnitEx {
  readonly unit: Unit;
  private _maxHealth = new BonusField<number>(0);
  private _health = 0;
  private _weapon: Weapon;
  private _resistances!: BonusField<Damage>;
  private _defense = 0;
  private _mana = 0;
  private _maxMana = new BonusField<number>(0);
  protected _level = 0;
  private _skills: Skill[] = [];
  private _skillMap: Record<string, Skill> = {};

  private listeners: (() => void)[] = [];
  private lastHealthLoss = 0;

  constructor(props: { unit: Unit });
  constructor(props: UnitExProps);
  constructor({
    unit,
    owner,
    x,
    y,
    facing,
    maxHealth = 1,
    weapon = { min: { physical: 1 }, max: { physical: 1 } },
    resistances = { holy: 1 },
    defense = 0,
    level,
  }: {
    unit: Unit | number | string;
    owner?: MapPlayer | number;
    x?: number;
    y?: number;
    facing?: number;
    maxHealth?: number;
    weapon?: WeaponInput;
    resistances?: Damage;
    defense?: number;
    level?: number;
  }) {
    if (typeof unit === "number" || typeof unit === "string") {
      if (owner == null) throw "Expected owner when passing in unit type";
      else if (x == null) throw "Expected x when passing in unit type";
      else if (y == null) throw "Expected y when passing in unit type";
      else {
        unit = new Unit(
          typeof owner === "number" ? MapPlayer.fromIndex(owner) : owner,
          typeof unit === "number" ? unit : FourCC(unit),
          // A spot to avoid spawning in a region
          -1056,
          0,
          facing ?? Math.random() * 360,
        );
      }
    }

    if (map.has(unit.handle)) throw "Duplicate UnitEx " + unit.typeId;
    map.set(unit.handle, this);
    this.unit = unit;

    if (maxHealth) this.maxBaseHealth = maxHealth;

    this._weapon = {
      min: new BonusField(weapon.min),
      max: new BonusField(weapon.max),
      projectile: weapon.projectile,
      projectileSpeed: weapon.projectileSpeed,
    };
    this._resistances = new BonusField(resistances);
    this.defense = defense;

    if (x && y) unit.setPosition(x, y);

    if (level) this._level = level;
  }

  public isAlly(whichPlayer: MapPlayer): boolean {
    return IsUnitAlly(this.unit.handle, whichPlayer.handle);
  }

  protected emitChange(): void {
    for (const fn of this.listeners) fn();
  }

  addEventListener(fn: () => void): void {
    this.listeners.push(fn);
  }

  removeEventListener(fn: () => void): void {
    const index = this.listeners.indexOf(fn);
    if (index >= 0) this.listeners.splice(index);
  }

  get health(): number {
    return this._health;
  }
  set health(value: number) {
    const oldValue = this._health;
    if (value < this._health) this.lastHealthLoss = getElapsedTime();
    this._health = value;
    // Only re-render on displayable changes
    if (
      (Math.floor(value) !== Math.floor(oldValue)) ||
      (Math.round(value) !== Math.round(oldValue))
    ) this.emitChange();
  }

  get maxHealth(): number {
    return this._maxHealth.total;
  }
  get maxBaseHealth(): number {
    return this._maxHealth.base;
  }
  set maxBaseHealth(value: number) {
    const curHealthPercent = this._maxHealth.total === 0
      ? 1
      : this._health / this._maxHealth.total;
    const healthChange = (value - this._maxHealth.base) * curHealthPercent;
    this._maxHealth.base = value;
    this._health += healthChange;
    this.emitChange();
  }
  get maxBonusHealth(): number {
    return this._maxHealth.bonus;
  }
  set maxBonusHealth(value: number) {
    const curHealthPercent = this._maxHealth.total === 0
      ? 1
      : this._health / this._maxHealth.total;
    const healthChange = (value - this._maxHealth.bonus) * curHealthPercent;
    this._maxHealth.bonus = value;
    this._health += healthChange;
    this.emitChange();
  }

  get healthRegen(): number {
    return this.lastHealthLoss + 5 > getElapsedTime() ? 0 : 1;
  }

  get mana(): number {
    return this._mana;
  }
  set mana(value: number) {
    const oldValue = this._mana;
    this._mana = value;
    // Only re-render on displayable changes
    if (
      (Math.floor(value) !== Math.floor(oldValue)) ||
      (Math.round(value) !== Math.round(oldValue))
    ) this.emitChange();
  }

  get maxMana(): number {
    return this._maxMana.total;
  }
  get maxBaseMana(): number {
    return this._maxMana.base;
  }
  set maxBaseMana(value: number) {
    const curManaPercent = this._maxMana.total === 0
      ? 1
      : this._mana / this._maxMana.total;
    const manaChange = (value - this._maxMana.base) * curManaPercent;
    this._maxMana.base = value;
    this._mana += manaChange;
    this.emitChange();
  }
  get maxBonusMana(): number {
    return this._maxMana.bonus;
  }
  set maxBonusMana(value: number) {
    const curManaPercent = this._maxMana.total === 0
      ? 1
      : this._mana / this._maxMana.total;
    const manaChange = (value - this._maxMana.bonus) * curManaPercent;
    this._maxMana.bonus = value;
    this._mana += manaChange;
    this.emitChange();
  }

  get manaRegen(): number {
    return this.maxMana / 120;
  }

  get weapon(): WeaponInput {
    return {
      min: this._weapon.min.total,
      max: this._weapon.max.total,
      projectile: this._weapon.projectile,
      projectileSpeed: this._weapon.projectileSpeed,
    };
  }
  get weaponMinBonus() {
    return this._weapon.min.bonus;
  }
  set weaponMinBonus(value: Damage) {
    this._weapon.min.bonus = value;
    this.emitChange();
  }
  setWeaponMinBonus(type: DamageType, value: number) {
    this._weapon.min.bonus[type] = value;
    this.emitChange();
  }
  adjustWeaponMinBonus(type: DamageType, value: number) {
    this._weapon.min.bonus[type] = (this._weapon.min.bonus[type] ?? 0) + value;
    this.emitChange();
  }
  get weaponMaxBonus() {
    return this._weapon.max.bonus;
  }
  set weaponMaxBonus(value: Damage) {
    this._weapon.max.bonus = value;
    this.emitChange();
  }
  setWeaponMaxBonus(type: DamageType, value: number) {
    this._weapon.max.bonus[type] = value;
    this.emitChange();
  }
  adjustWeaponMaxBonus(type: DamageType, value: number) {
    this._weapon.max.bonus[type] = (this._weapon.max.bonus[type] ?? 0) + value;
    this.emitChange();
  }

  get resistances(): Damage {
    return this._resistances.total;
  }

  get defense(): number {
    return this._defense;
  }
  set defense(value: number) {
    this._defense = value;
    this.emitChange();
  }

  get owner(): MapPlayer {
    return this.unit.owner;
  }

  get facing(): number {
    return this.unit.facing;
  }

  set facing(degrees: number) {
    this.unit.facing = degrees;
    this.emitChange();
  }

  setAnimation(whichAnimation: string | number): void {
    this.unit.setAnimation(whichAnimation);
  }

  get x(): number {
    return this.unit.x;
  }

  set x(value: number) {
    this.unit.x = value;
    this.emitChange();
  }

  get y(): number {
    return this.unit.y;
  }

  set y(value: number) {
    this.unit.y = value;
    this.emitChange();
  }

  get handle(): unit {
    return this.unit.handle;
  }

  randomDamage(): Damage {
    return randomDamage(this.weapon.min, this.weapon.max);
  }

  damage(target: UnitEx, damage: Damage): void {
    for (const damageType of damageTypes) {
      const rawDamageFromType = damage[damageType];
      if (typeof rawDamageFromType !== "number") continue;

      const damageFromType = rawDamageFromType *
        (1 - (target._resistances[damageType] ?? 0));

      target.health = Math.max(0, target.health - damageFromType);

      if (damageFromType >= 0.05) {
        const tt = new TextTag();
        tt.setText(colorize[damageType](formatNumber(damageFromType)), 0.03);
        const angle = Math.random() * Math.PI;
        const xOffset = Math.cos(angle) * 32;
        const yOffset = Math.sin(angle) * 32;
        tt.setPos(target.x + xOffset, target.y + yOffset, 20);
        tt.setColor(255, 0, 0, 255);
        tt.setVelocity(xOffset / 1024, yOffset / 1024);
        tt.setVisible(true);
        tt.setFadepoint(0.5);
        tt.setLifespan(2);
        tt.setPermanent(false);
      }

      withDamageSystemOff(() => {
        this.unit.damageTarget(
          target.unit.handle,
          25,
          true,
          false,
          ATTACK_TYPE_NORMAL,
          DAMAGE_TYPE_NORMAL,
          WEAPON_TYPE_WHOKNOWS,
        );
      });
    }

    if (target.health <= 0) target.unit.kill();
  }

  doMeleeAttack(): void {
    const damage = this.randomDamage();

    const facing = Deg2Rad(this.unit.facing);
    const x = this.unit.x + 64 * Math.cos(facing);
    const y = this.unit.y + 64 * Math.sin(facing);

    let foundAUnit = false;
    dummyGroup.enumUnitsInRange(
      x,
      y,
      128,
      Filter((): boolean => {
        if (foundAUnit) return false;

        const u = UnitEx.fromFilter()!;

        if (u.isAlly(this.unit.owner) || u.health <= 0) return false;
        foundAUnit = true;

        // TODO: simulate defense
        this.damage(u, damage);

        return false;
      }),
    );
    dummyGroup.clear();
  }

  distanceTo(target: UnitEx): number {
    return Math.sqrt(
      (this.unit.y - target.unit.y) ** 2 +
        (this.unit.x - target.unit.x) ** 2,
    );
  }

  addSkill(skill: Skill): void {
    this._skills.push(skill);
    this._skillMap[skill.name] = skill;
    registerCommand(
      {
        name: skill.name,
        shortcuts: [{ mouse: "right" }],
        damage: skill.damage,
        fn: (playerId) => {
          if (!skill.validate(playerId)) return false;
          queueAction(playerId, {
            perform: (done) => skill.perform(playerId, done),
            interruptable: false,
          });
          return true;
        },
      },
      this.owner.id,
    );
  }

  incSkillLevel(skillName: SkillName, levels?: number): void {
    const hasSkill = !!this._skillMap[skillName];
    if (!hasSkill) this.addSkill(skillMap[skillName]());

    const skill = this._skillMap[skillName];
    skill.setLevel(skill.level + (levels ?? 1));
  }

  faceTarget(target: Vector2): void {
    const angle = Rad2Deg(Vector2Ex.angleBetweenVectors(this, target));
    this.unit.facing = angle;
  }

  public static fromHandle(unit: unit): UnitEx;
  public static fromHandle(unit: null): null;
  public static fromHandle(unit: unit | null): UnitEx | null {
    if (!unit) return null;
    let unitEx = map.get(unit);

    // Hopefully a pre-placed unit
    if (unitEx == null) {
      unitEx = new UnitEx({ unit: Unit.fromHandle(unit) });
    }

    // throw "Called UnitEx.fromHandle with an unknown unit";
    return unitEx;
  }

  public static fromUnit(unit: Unit): UnitEx {
    return this.fromHandle(unit.handle);
  }

  public static fromFilter(): UnitEx | null {
    const u = GetFilterUnit();
    if (!u) return null;
    return this.fromHandle(u);
  }

  public static fromEvent(): UnitEx | null {
    const u = GetTriggerUnit();
    if (!u) return null;
    return this.fromHandle(u);
  }

  get level(): number {
    return this._level;
  }
}
