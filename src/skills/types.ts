import { Command } from "../input/commands/types";

export interface Skill {
	name: string;
	level: number;
	perform: Command["fn"];
}
