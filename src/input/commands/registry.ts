import { times } from "../../util";
import { setSubtract } from "../../util/set";
import { Command, CommandInternal, Shortcut, ShortcutInternal } from "./types";

export const playersCommands: CommandInternal[][] = times(
	bj_MAX_PLAYER_SLOTS,
	() => [],
);

export const primaryCommands: (CommandInternal | null)[] = times(
	bj_MAX_PLAYER_SLOTS,
	() => null,
);

export const secondaryCommands: (CommandInternal | null)[] = times(
	bj_MAX_PLAYER_SLOTS,
	() => null,
);

const normalizeShortcut = (shortcut: Shortcut): ShortcutInternal => ({
	mouse:
		typeof shortcut.mouse === "string"
			? [shortcut.mouse]
			: shortcut.mouse ?? [],
	keyboard:
		typeof shortcut.keyboard === "string"
			? [shortcut.keyboard]
			: shortcut.keyboard ?? [],
});

const normalizeCommand = (command: Command): CommandInternal => {
	command.priority = command.priority ?? 0;
	command.shortcuts = (command.shortcuts ?? []).map((s) =>
		normalizeShortcut(s),
	);
	return command as CommandInternal;
};

const isShortcutSubset = (
	subset: ShortcutInternal,
	baseset: ShortcutInternal,
) =>
	subset.mouse.every((m) => baseset.mouse.includes(m)) &&
	subset.keyboard.every((m) => baseset.keyboard.includes(m));

export const getCommands = (
	playerId: number,
	shortcut: Shortcut,
): CommandInternal[] => {
	const normalizedShortcut = normalizeShortcut(shortcut);
	const playerCommands = playersCommands[playerId];

	const matchingCommands = playerCommands.filter((command) =>
		command.shortcuts.some((testShortcut) =>
			isShortcutSubset(testShortcut, normalizedShortcut),
		),
	);

	return matchingCommands.sort((a, b) => b.priority - a.priority);
};

const registerCommandForPlayer = (command: Command, playerId: number): void => {
	const playerCommands = playersCommands[playerId];

	const normalizedCommand = normalizeCommand(command);

	const conflicts = [];
	for (const shortcut of normalizedCommand.shortcuts)
		for (const existingCommand of playerCommands)
			for (const existingShortcut of existingCommand.shortcuts)
				if (
					(isShortcutSubset(shortcut, existingShortcut) ||
						isShortcutSubset(existingShortcut, shortcut)) &&
					normalizedCommand.priority === existingCommand.priority
				)
					conflicts.push(existingCommand);

	setSubtract(playerCommands, conflicts);

	const primaryShortcut = normalizedCommand.shortcuts.find(
		(s) =>
			s.keyboard.length === 1 &&
			s.keyboard[0] === "shift" &&
			s.mouse.length === 1 &&
			s.mouse[0] === "left",
	);
	if (primaryShortcut) primaryCommands[playerId] = normalizedCommand;

	const secondaryShortcut = normalizedCommand.shortcuts.find(
		(s) =>
			s.keyboard.length === 0 &&
			s.mouse.length === 1 &&
			s.mouse[0] === "right",
	);
	if (secondaryShortcut) secondaryCommands[playerId] = normalizedCommand;

	playerCommands.push(normalizedCommand);
};

/**
 * Adds a command to a player (or all players if unblank) registry.
 */
export const registerCommand = (command: Command, playerId?: number): void => {
	if (typeof playerId === "number")
		registerCommandForPlayer(command, playerId);

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++)
		registerCommandForPlayer(command, i);
};

export const processShortcut = (playerId: number, shortcut: Shortcut): void => {
	const commands = getCommands(playerId, shortcut);

	for (const command of commands) if (command.fn(playerId)) return;
};

export const test = {
	reset: (): void =>
		playersCommands.forEach((commands) => commands.splice(0)),
	playersCommands,
};
