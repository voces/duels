import { Region } from "@voces/w3ts";

import { UnitEx } from "../units/UnitEx";

let town: Region;

export const isInTown = (unit: UnitEx): boolean => town.containsUnit(unit.unit);

export const setTown = (region: Region): void => {
  town = region;
};
