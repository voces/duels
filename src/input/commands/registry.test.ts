import { getCommands, registerCommand, test } from "./registry";
import { Command } from "./types";

beforeEach(() => test.reset());

describe("registerCommand", () => {
  const testCommandA: Command = {
    name: "Command A",
    shortcuts: "a",
    fn: jest.fn(),
  };

  const testCommandB: Command = {
    name: "Command B",
    shortcuts: ["b"],
    fn: jest.fn(),
  };

  const testCommandShiftA: Command = {
    name: "Command Shift A",
    shortcuts: ["a", "shift"],
    fn: jest.fn(),
  };

  it("supports multiple commands", () => {
    registerCommand(testCommandA);
    registerCommand(testCommandB);

    expect(test.playersCommands[0].map((c) => c.name)).toEqual([
      "Command A",
      "Command B",
    ]);
  });

  it("a conflict keeps the previous commands", () => {
    registerCommand(testCommandA);
    registerCommand(testCommandShiftA);

    expect(test.playersCommands[0].map((c) => c.name)).toEqual([
      "Command Shift A",
    ]);
  });

  it("a priority absolves a conflict", () => {
    registerCommand(testCommandA);
    registerCommand({ ...testCommandShiftA, priority: 1 });

    expect(test.playersCommands[0].map((c) => c.name)).toEqual([
      "Command A",
      "Command Shift A",
    ]);
  });

  it("equal priorities conflict", () => {
    registerCommand({ ...testCommandA, priority: 1 });
    registerCommand({ ...testCommandShiftA, priority: 1 });

    expect(test.playersCommands[0].map((c) => c.name)).toEqual([
      "Command Shift A",
    ]);
  });
});

describe("getCommands", () => {
  describe("filters", () => {
    beforeEach(() => {
      const testCommandLeft: Command = {
        name: "Command Left",
        shortcuts: "left",
        priority: 0,
        fn: jest.fn(),
      };
      const testCommandShiftLeft: Command = {
        name: "Command Shift",
        shortcuts: ["shift"],
        priority: 1,
        fn: jest.fn(),
      };
      const testCommandShift: Command = {
        name: "Command Shift Left",
        shortcuts: ["left", "shift"],
        priority: 2,
        fn: jest.fn(),
      };
      registerCommand(testCommandLeft);
      registerCommand(testCommandShiftLeft);
      registerCommand(testCommandShift);
    });

    it("none", () => {
      expect(getCommands(0, [])).toEqual([]);
    });

    it("mouse", () => {
      expect(
        getCommands(0, "left").map((c) => c.name),
      ).toEqual(["Command Left"]);
    });

    it("keyboard", () => {
      expect(
        getCommands(0, ["shift"]).map((c) => c.name),
      ).toEqual(["Command Shift"]);
    });

    it("unrelated keyboard", () => {
      expect(getCommands(0, "a")).toEqual([]);
    });

    it("mouse+keyboard", () => {
      expect(
        getCommands(0, ["left", "shift"]).map(
          (c) => c.name,
        ),
      ).toEqual(["Command Shift Left", "Command Shift", "Command Left"]);
    });
  });

  it("sorts", () => {
    const makeCommand = (name: string, priority?: number): Command => ({
      name: "Command " + name,
      shortcuts: ["left"],
      priority,
      fn: jest.fn(),
    });
    registerCommand(makeCommand("D", 1));
    registerCommand(makeCommand("F", 3));
    registerCommand(makeCommand("B", -1));
    registerCommand(makeCommand("C", 0));
    registerCommand(makeCommand("E", 2));
    registerCommand(makeCommand("A", -2));

    expect(getCommands(0, "left").map((c) => c.name)).toEqual([
      "Command F",
      "Command E",
      "Command D",
      "Command C",
      "Command B",
      "Command A",
    ]);
  });
});
