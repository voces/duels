import { createElement, useCallback } from "w3ts-jsx";
import { Hero } from "../../../units/Hero";
import { Tooltip } from "../../components/Tooltip";
import { useRefState } from "../../hooks/useRefState";
import { useUnitListener } from "../../hooks/useUnitListener";
import { genItemText } from "../../util/genItemText";
import { rightToLeft, top, topLeft } from "../../util/pos";

const offset = {
  mainHand: { x: 70, y: -245 },
  offHand: { x: 188.5, y: -245 },
  head: { x: 129.25, y: -120 },
  boots: { x: 129.25, y: -330 },
  gloves: { x: 70, y: -150 },
  armor: { x: 129.25, y: -170 },
  belt: { x: 129.25, y: -225 },
  amulet: { x: 188.5, y: -150 },
  mainRing: { x: 70, y: -198 },
  offRing: { x: 188.5, y: -198 },
};

const EquipmentSlot = (
  { hero, slot }: { hero: Hero; slot: keyof Hero["equipment"] },
) => {
  useUnitListener(hero, `equipment-${slot}`);
  const item = hero.equipment[slot];
  const containerRef = useRefState<framehandle | null>(null);

  const onClick = useCallback(() => {
    const item = hero.equipment[slot];
    if (!item) return;
    hero.unequip(item);
  }, [hero]);

  return (
    <button
      inherits="IconButtonTemplate"
      position={topLeft(offset[slot])}
      size={41.5}
      alpha={item ? 255 : 0}
      ref={containerRef}
      tooltip={containerRef.current &&
        (
          <Tooltip visible={!!item}>
            <text
              text={item ? genItemText(item) : undefined}
              position={rightToLeft({
                relative: containerRef.current,
                x: -28,
                y: -16,
              })}
            />
          </Tooltip>
        )}
      onClick={onClick}
    >
      <backdrop
        position="parent"
        texture={item?.image}
      />
    </button>
  );
};

export const Equipment = (
  { hero, visible }: { hero: Hero; visible: boolean },
) => {
  return (
    <container
      size={{ width: 300, height: 393 }}
      absPosition={{ point: FRAMEPOINT_TOPRIGHT, x: 1600 - 64, y: 1200 - 128 }}
      visible={visible}
    >
      <backdrop texture="assets/img2/Equipment" position="parent" />
      <text text="Equipment" position={top({ y: -82 })} />
      <EquipmentSlot slot="mainHand" hero={hero} />
      <EquipmentSlot slot="offHand" hero={hero} />
      <EquipmentSlot slot="head" hero={hero} />
      <EquipmentSlot slot="boots" hero={hero} />
      <EquipmentSlot slot="armor" hero={hero} />
      <EquipmentSlot slot="belt" hero={hero} />
      <EquipmentSlot slot="amulet" hero={hero} />
      <EquipmentSlot slot="mainRing" hero={hero} />
      <EquipmentSlot slot="offRing" hero={hero} />
      <EquipmentSlot slot="gloves" hero={hero} />
    </container>
  );
};
