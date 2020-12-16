import { SkillAffix } from "./suffixes/skills";

export interface BaseAffix {
	affix: "prefix" | "suffix";
	name: string;
}

export type Affix = SkillAffix;
