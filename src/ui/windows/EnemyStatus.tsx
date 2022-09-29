import { createElement } from "w3ts-jsx";
import { StatusBar } from "../components/StatusBar";
import { useMouseTarget } from "../hooks/useMouseTarget";
import { useUnitListener } from "../hooks/useUnitListener";
import { top, topDown, topLeft } from "../util/pos";

export const EnemyStatus = () => {
  const target = useMouseTarget();
  useUnitListener(target);
  return (
    <container
      absPosition={{
        point: FRAMEPOINT_TOP,
        x: 800,
        y: 1200 - 48,
      }}
      size={{
        width: 200,
        height: 100,
      }}
      visible={!!target}
    >
      <container position={topLeft()} size={{ width: 200, height: 16 }}>
        <text
          text={target ? target.unit.name : ""}
          position={[top()]}
        />
      </container>
      <StatusBar
        position={topDown({ y: -4 })}
        size={{ width: 200, height: 32 }}
        text=""
        value={target ? target.health : 1}
        max={target ? target.maxHealth : 1}
        barTexture="assets/img2/HP_bar_mini_line"
      />
    </container>
  );
};
