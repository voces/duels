import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { Hero } from "../../Hero";
import { heroTypeMap } from "../../types";
import { useUnitListener } from "../hooks/useUnitListener";
import { LargeText } from "../Text";
import { Row } from "./Row";
import { WIDTH } from "./shared";

const incStat = (
	hero: Hero,
	stat: "strength" | "dexterity" | "vitality" | "energy",
) => {
	if (hero.unasignedStatPoints <= 0) return;
	hero.unasignedStatPoints--;
	hero[stat]++;
};

export const Character = ({
	hero,
	visible,
}: {
	hero: Hero;
	visible: boolean;
}): React.Node => {
	useUnitListener(hero);
	return (
		<container
			size={{ width: WIDTH, height: WIDTH * 2 }}
			absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 128, y: 1200 - 350 }}
			visible={visible}
		>
			<backdrop
				texture="assets/img/stats_bar3"
				position={[
					{
						point: FRAMEPOINT_BOTTOMLEFT,
						relative: "parent",
						relativePoint: FRAMEPOINT_BOTTOMLEFT,
						x: -48,
						y: -48,
					},
					{
						point: FRAMEPOINT_TOPRIGHT,
						relative: "parent",
						relativePoint: FRAMEPOINT_TOPRIGHT,
						x: 48,
						y: 154,
					},
				]}
			/>
			<LargeText
				text="Character"
				position={{
					point: FRAMEPOINT_TOP,
					relative: "parent",
					relativePoint: FRAMEPOINT_TOP,
					y: 80,
				}}
			/>
			<Row
				name="Class"
				value={heroTypeMap[hero.unit.typeId].name}
				first
			/>
			<Row name="Level" value={hero.level.toString()} />
			<Row
				name="Experience"
				value={Math.round(hero.expierence).toString()}
			/>
			<Row
				name="Unassigned stat points"
				value={hero.unasignedStatPoints.toString()}
			/>

			<Row
				name="Strength"
				value={hero.strength.toString()}
				canIncrement={hero.unasignedStatPoints > 0}
				onIncrement={() => incStat(hero, "strength")}
				header
			/>
			<Row name="Attack damage (Strike)" value={"1-6"} />
			<Row name="Attack damage (Jab)" value={"1-5"} />

			<Row
				name="Dexterity"
				value={hero.dexterity.toString()}
				canIncrement={hero.unasignedStatPoints > 0}
				onIncrement={() => incStat(hero, "dexterity")}
				header
			/>
			<Row name="Attack rating (Strike)" value={"95"} />
			<Row name="Attack rating (Jab)" value={"105"} />
			<Row name="Defense" value={"21"} />

			<Row
				name="Vitality"
				value={hero.vitality.toString()}
				canIncrement={hero.unasignedStatPoints > 0}
				onIncrement={() => incStat(hero, "vitality")}
				header
			/>
			<Row
				name="Stamina"
				value={`${hero.stamina.toString()}/${hero.maxStamina.toString()}`}
			/>
			<Row
				name="Health"
				value={`${Math.round(
					hero.health,
				).toString()}/${hero.maxHealth.toString()}`}
			/>

			<Row
				name="Energy"
				value={hero.energy.toString()}
				canIncrement={hero.unasignedStatPoints > 0}
				onIncrement={() => incStat(hero, "energy")}
				header
			/>
			<Row
				name="Mana"
				value={`${hero.mana.toString()}/${hero.maxMana.toString()}`}
			/>

			<Row name="Fire resistance" value={"0"} gap />
			<Row name="Cold resistance" value={"0"} />
			<Row name="Lightning resistance" value={"0"} />
			<Row name="Poison resistance" value={"0"} />
		</container>
	);
};
