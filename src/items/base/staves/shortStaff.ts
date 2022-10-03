import { buildWeaponDamageMultiplierEffect } from "../../../effects/weaponDamageMultiplier";
import { Item } from "../../Item";

export const buildShortStaff = (overrides?: Partial<Item>): Item => ({
  name: "Short Staff",
  slot: "hands",
  image: "assets/img2/staff",
  durability: 20,
  sockets: 2,
  attackSpeed: 0.9,
  ...overrides,
  damage: { min: 1, max: 5, ...overrides?.damage },
  effects: overrides?.effects ?? [
    buildWeaponDamageMultiplierEffect({
      damageType: "holy",
      multipler: 0.5,
    }),
  ],
  affixes: overrides?.affixes ?? [],
});
