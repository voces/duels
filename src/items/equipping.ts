import { applyEffect, unapplyEffect } from "../effects/types";
import { Hero } from "../units/Hero";
import { Item } from "./Item";

export const equipItem = (item: Item, hero: Hero): void => {
  item.effects.forEach((effect) => applyEffect(effect, hero));
  item.affixes.forEach((affix) => applyEffect(affix.effect, hero));
};

export const unequipItem = (item: Item, hero: Hero): void => {
  item.effects.forEach((effect) => unapplyEffect(effect, hero));
  item.affixes.forEach((affix) => unapplyEffect(affix.effect, hero));
};
