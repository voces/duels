import * as React from "../../../node_modules/w3ts-jsx/dist/src/index";
import { heroData } from "../../types";
import { Row } from "./Row";
import { WIDTH } from "./shared";

export const Attributes = (): React.Node => {
	const heroState = {
		class: "amazon",
		strength: 20,
		dexterity: 25,
		vitality: 20,
		energy: 15,
		health: 52,
		maxHealth: 52,
		stamina: 86,
		maxStamina: 86,
		mana: 16,
		maxMana: 16,
		healthPerLevel: 2,
		staminaPerLevel: 1,
		manaPerLevel: 1.5,
		healthPerVitality: 3,
		staminaPerVitality: 1,
		manaPerEnergy: 1.5,

		unasignedStatPoints: 5,

		level: 2,
		expierence: 616,
	} as const;

	return (
		<container
			size={{ width: WIDTH, height: 440 }}
			absPosition={{ point: FRAMEPOINT_TOPLEFT, x: 128, y: 1200 - 512 }}
		>
			<backdrop
				inherits="BattleNetControlBackdropTemplate"
				position={[
					{
						point: FRAMEPOINT_BOTTOMLEFT,
						relative: "parent",
						relativePoint: FRAMEPOINT_BOTTOMLEFT,
						x: -32,
						y: -32,
					},
					{
						point: FRAMEPOINT_TOPRIGHT,
						relative: "parent",
						relativePoint: FRAMEPOINT_TOPRIGHT,
						x: 32,
						y: 32,
					},
				]}
			/>
			<Row name="Class" value={heroData[heroState.class].name} first />
			<Row name="Level" value={heroState.level.toString()} />
			<Row name="Experience" value={heroState.expierence.toString()} />
			<Row
				name="Unassigned stat points"
				value={heroState.unasignedStatPoints.toString()}
			/>

			<Row
				name="Strength"
				value={heroState.strength.toString()}
				gap
				canIncrement={heroState.unasignedStatPoints > 0}
				onIncrement={() => {}}
			/>
			<Row name="Attack damage (Strike)" value={"1-6"} />
			<Row name="Attack damage (Jab)" value={"1-5"} />

			<Row
				name="Dexterity"
				value={heroState.dexterity.toString()}
				gap
				canIncrement={heroState.unasignedStatPoints > 0}
				onIncrement={() => {}}
			/>
			<Row name="Attack rating (Strike)" value={"95"} />
			<Row name="Attack rating (Jab)" value={"105"} />
			<Row name="Defense" value={"21"} />

			<Row
				name="Vitality"
				value={heroState.vitality.toString()}
				gap
				canIncrement={heroState.unasignedStatPoints > 0}
				onIncrement={() => {}}
			/>
			<Row
				name="Stamina"
				value={`${heroState.stamina.toString()}/${heroState.maxStamina.toString()}`}
			/>
			<Row
				name="Health"
				value={`${heroState.health.toString()}/${heroState.maxHealth.toString()}`}
			/>

			<Row
				name="Energy"
				value={heroState.energy.toString()}
				gap
				canIncrement={heroState.unasignedStatPoints > 0}
				onIncrement={() => {}}
			/>
			<Row
				name="Mana"
				value={`${heroState.mana.toString()}/${heroState.maxMana.toString()}`}
			/>

			<Row name="Fire resistance" value={"0"} gap />
			<Row name="Cold resistance" value={"0"} />
			<Row name="Lightning resistance" value={"0"} />
			<Row name="Poison resistance" value={"0"} />
		</container>
	);
};
