import { SkillBonusEffect } from "../../../effects/skillBonus";
import { BaseAffix } from "../types";

export interface SkillAffix extends BaseAffix {
	affix: "suffix";
	effect: SkillBonusEffect;
}

export const buildOfFireBolt = (
	overrides?: DeepPartial<SkillAffix>,
): SkillAffix => ({
	affix: "suffix",
	name: "of Fire Bolt",
	...overrides,
	effect: {
		type: "skillBonus",
		skill: "Firebolt",
		levels: GetRandomInt(1, 3),
		...overrides?.effect,
	},
});
