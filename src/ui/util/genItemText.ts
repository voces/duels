import { Item } from "../../items/Item";

export const genItemText = (item: Item) =>
  [
    [
      //   ...(item.affixes ?? []).filter((a) => a.affix === "prefix").map((s) =>
      //     s.name
      //   ),
      item.name,
      ...(item.affixes ?? []).filter((a) => a.affix === "suffix").map((s) =>
        s.name
      ),
    ].join(" "),
    ...([
      ...(item.affixes?.map((a) => a.effect) ?? []),
      ...(item.effects ?? []),
    ].map(
      (effect) => {
        switch (effect.type) {
          case "restoreHealth":
            return `Restores ${effect.amount} health on use`;
          case "restoreMana":
            return `Restores ${effect.amount} mana on use`;
          case "skillBonus":
            return `+${effect.levels} to ${effect.skill}`;
          case "weaponDamageMultiplier":
            return `+${
              Math.round(effect.multipler * 100)
            }% ${effect.damageType} damage`;
        }
      },
    ).filter((v) => v !== undefined) ?? []),
  ].join("|n");
