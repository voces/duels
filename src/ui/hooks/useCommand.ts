import { useEffect, useState } from "w3ts-jsx";
import {
  registerCommand,
  unregisterCommand,
} from "../../input/commands/registry";
import { Command, Shortcut } from "../../input/commands/types";

export const useCommand = (command: Command, playerId?: number) => {
  registerCommand(command, playerId);
  useEffect(() => unregisterCommand({ fn: command.fn }, playerId));
};

export const useShortcut = (
  { shortcut, fn, name, priority }: {
    shortcut?: Command["shortcuts"];
    fn?: (playerId: number) => boolean;
    name?: string;
    priority?: number;
  },
) => {
  // const [command, setCommand] = useState<Command | undefined>(undefined);

  useEffect(() => {
    if (
      !name || !shortcut || !fn ||
      Array.isArray(shortcut) && shortcut.length === 0
    ) {
      return;
    }

    const command: Command = {
      name,
      fn,
      shortcuts: shortcut,
      priority,
    };
    // TODO: this breaks webui?
    // setCommand(command);

    const localPlayerId = GetPlayerId(GetLocalPlayer()!);
    registerCommand(command, localPlayerId);

    return () => unregisterCommand(command, localPlayerId);
  }, [shortcut, fn, name, priority]);

  // return command;
};
