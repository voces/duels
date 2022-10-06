import { applyEffect, unapplyEffect, useEffect } from "../effects";
import { Hero } from "../units/Hero";
import { Item } from "./Item";

export const equipItem = (item: Item, hero: Hero): void => {
  item.effects?.forEach((effect) => applyEffect(effect, hero));
  item.affixes?.forEach((affix) => applyEffect(affix.effect, hero));
};

export const unequipItem = (item: Item, hero: Hero): void => {
  item.effects?.forEach((effect) => unapplyEffect(effect, hero));
  item.affixes?.forEach((affix) => unapplyEffect(affix.effect, hero));
};

export const useItem = (item: Item, hero: Hero): void => {
  item.effects?.forEach((effect) => useEffect(effect, hero));
  item.affixes?.forEach((affix) => useEffect(affix.effect, hero));
  if (item.consumable) {
    if (!item.stacks || item.stacks === 1) hero.removeItemFromInventory(item);
    else item.stacks--;
  }
};
