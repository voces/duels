import { DamageRange } from "../../damage";

export type MouseShortcut = "left" | "right";
export type KeyboardShortcut =
  | "shift"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

export type Shortcut =
  | MouseShortcut
  | KeyboardShortcut
  | (MouseShortcut | KeyboardShortcut)[];

export type ShortcutInternal = (MouseShortcut | KeyboardShortcut)[];

export interface Command<> {
  description?: string;
  /**
   * The function that is invoked for the command. Should return true if
   * further possible commands should not be executed; return false if the
   * next command should be executed.
   */
  fn: (playerId: number) => boolean;
  name: string;
  /**
   * If a shortcut can trigger multiple commands, the commands with the
   * highest priority are attempted first. Commands stop being attempted
   * after one returns true.
   */
  priority?: number;
  shortcuts?: Shortcut | (MouseShortcut | KeyboardShortcut)[][];
  damage?:
    | DamageRange
    | ((playerId: number) => DamageRange | undefined);
}

export interface CommandInternal extends Command {
  priority: number;
  shortcuts: ShortcutInternal[];
}
