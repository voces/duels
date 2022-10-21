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

const normalizeShortcut = (shortcut: Shortcut): ShortcutInternal =>
  Array.isArray(shortcut) ? shortcut : [shortcut];

const normalizeCommand = (command: Command): CommandInternal => {
  command.priority = command.priority ?? 0;

  if (command.shortcuts) {
    if (Array.isArray(command.shortcuts)) {
      if (Array.isArray(command.shortcuts[0])) {
        command.shortcuts = command.shortcuts.map((s) => normalizeShortcut(s));
      } else {command.shortcuts = [
          normalizeShortcut(command.shortcuts as Shortcut),
        ];}
    } else command.shortcuts = [[command.shortcuts]];
  } else command.shortcuts = [];

  return command as CommandInternal;
};

export const getCommands = (
  playerId: number,
  shortcut: Shortcut,
): CommandInternal[] => {
  const normalizedShortcut = normalizeShortcut(shortcut);
  const playerCommands = playersCommands[playerId];

  const matchingCommands = playerCommands.filter((command) =>
    command.shortcuts.some((testShortcut) =>
      testShortcut.every((s) => normalizedShortcut.includes(s))
    )
  );

  return matchingCommands.sort((a, b) => b.priority - a.priority);
};

const registerCommandForPlayer = (command: Command, playerId: number): void => {
  const playerCommands = playersCommands[playerId];

  const normalizedCommand = normalizeCommand(command);

  // const conflicts = [];
  // for (const shortcut of normalizedCommand.shortcuts) {
  //   for (const existingCommand of playerCommands) {
  //     for (const existingShortcut of existingCommand.shortcuts) {
  //       if (
  //         (isShortcutSubset(shortcut, existingShortcut) ||
  //           isShortcutSubset(existingShortcut, shortcut)) &&
  //         normalizedCommand.priority === existingCommand.priority
  //       ) {
  //         conflicts.push(existingCommand);
  //       }
  //     }
  //   }
  // }

  // setSubtract(playerCommands, conflicts);

  const primaryShortcut = normalizedCommand.shortcuts.find(
    (s) =>
      s.length === 2 && s[0] !== s[1] &&
      s.every((v) => v === "shift" || v === "left"),
  );
  if (primaryShortcut) primaryCommands[playerId] = normalizedCommand;

  const secondaryShortcut = normalizedCommand.shortcuts.find(
    (s) => s.length === 0 && s[0] === "right",
  );
  if (secondaryShortcut) secondaryCommands[playerId] = normalizedCommand;

  playerCommands.push(normalizedCommand);
};

/**
 * Adds a command to a player (or all players if unblank) registry.
 */
export const registerCommand = (command: Command, playerId?: number): void => {
  if (typeof playerId === "number") {
    return registerCommandForPlayer(command, playerId);
  }

  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    registerCommandForPlayer(command, i);
  }
};

const unregisterCommandForPlayer = (
  command: Pick<Command, "fn">,
  playerId: number,
) => {
  const playerCommands = playersCommands[playerId];

  for (let i = 0; i < playerCommands.length; i++) {
    if (playerCommands[i].fn === command.fn) {
      playerCommands.splice(i, 1);
      i--;
    }
  }

  if (primaryCommands[playerId]?.fn === command.fn) {
    primaryCommands[playerId] = null;
  }

  if (secondaryCommands[playerId]?.fn === command.fn) {
    secondaryCommands[playerId] = null;
  }
};

export const unregisterCommand = (
  command: Pick<Command, "fn">,
  playerId?: number,
): void => {
  if (typeof playerId === "number") {
    return unregisterCommandForPlayer(command, playerId);
  }

  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    unregisterCommandForPlayer(command, i);
  }
};

export const processShortcut = (playerId: number, shortcut: Shortcut): void => {
  const commands = getCommands(playerId, shortcut);

  for (const command of commands) if (command.fn(playerId)) return;
};

export const test = {
  reset: (): void => playersCommands.forEach((commands) => commands.splice(0)),
  playersCommands,
};
