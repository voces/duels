import { buildWeaponDamageMultiplierEffect } from "../../../effects/weaponDamageMultiplier";
import { Item } from "../../Item";

export const buildShortStaff = (overrides?: Partial<Item>): Item => ({
	slot: "hands",
	slotSize: { width: 1, height: 3 },
	durability: 20,
	sockets: 2,
	attackSpeed: 0.9,
	...overrides,
	damage: { min: 1, max: 5, ...overrides?.damage },
	effects: overrides?.effects ?? [
		buildWeaponDamageMultiplierEffect({
			damageType: "holy",
			multipler: 1.5,
		}),
	],
	affixes: overrides?.affixes ?? [],
});
