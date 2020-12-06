import { getCommands, registerCommand, test } from "./registry";
import { Command } from "./types";

beforeEach(() => test.reset());

describe("registerCommand", () => {
	const testCommandA: Command = {
		name: "Command A",
		shortcuts: [{ keyboard: "a" }],
		fn: jest.fn(),
	};

	const testCommandB: Command = {
		name: "Command B",
		shortcuts: [{ keyboard: "b" }],
		fn: jest.fn(),
	};

	const testCommandShiftA: Command = {
		name: "Command Shift A",
		shortcuts: [{ keyboard: ["a", "shift"] }],
		fn: jest.fn(),
	};

	it("supports multiple commands", () => {
		registerCommand(0, testCommandA);
		registerCommand(0, testCommandB);

		expect(test.playersCommands[0].map((c) => c.name)).toEqual([
			"Command A",
			"Command B",
		]);
	});

	it("a conflict removes previous commands", () => {
		registerCommand(0, testCommandA);
		registerCommand(0, testCommandShiftA);

		expect(test.playersCommands[0].map((c) => c.name)).toEqual([
			"Command Shift A",
		]);
	});

	it("a priority absolves a conflict", () => {
		registerCommand(0, testCommandA);
		registerCommand(0, { ...testCommandShiftA, priority: 1 });

		expect(test.playersCommands[0].map((c) => c.name)).toEqual([
			"Command A",
			"Command Shift A",
		]);
	});

	it("equal priorities conflict", () => {
		registerCommand(0, { ...testCommandA, priority: 1 });
		registerCommand(0, { ...testCommandShiftA, priority: 1 });

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
				shortcuts: [{ mouse: "left" }],
				priority: 0,
				fn: jest.fn(),
			};
			const testCommandShiftLeft: Command = {
				name: "Command Shift",
				shortcuts: [{ keyboard: "shift" }],
				priority: 1,
				fn: jest.fn(),
			};
			const testCommandShift: Command = {
				name: "Command Shift Left",
				shortcuts: [{ mouse: "left", keyboard: "shift" }],
				priority: 2,
				fn: jest.fn(),
			};
			registerCommand(0, testCommandLeft);
			registerCommand(0, testCommandShiftLeft);
			registerCommand(0, testCommandShift);
		});

		it("none", () => {
			expect(getCommands(0, {})).toEqual([]);
		});

		it("mouse", () => {
			expect(
				getCommands(0, { mouse: "left" }).map((c) => c.name),
			).toEqual(["Command Left"]);
		});

		it("keyboard", () => {
			expect(
				getCommands(0, { keyboard: "shift" }).map((c) => c.name),
			).toEqual(["Command Shift"]);
		});

		it("unrelated keyboard", () => {
			expect(getCommands(0, { keyboard: "a" })).toEqual([]);
		});

		it("mouse+keyboard", () => {
			expect(
				getCommands(0, { mouse: "left", keyboard: "shift" }).map(
					(c) => c.name,
				),
			).toEqual(["Command Shift Left", "Command Shift", "Command Left"]);
		});
	});

	it("sorts", () => {
		const makeCommand = (name: string, priority?: number): Command => ({
			name: "Command " + name,
			shortcuts: [{ mouse: "left" }],
			priority,
			fn: jest.fn(),
		});
		registerCommand(0, makeCommand("D", 1));
		registerCommand(0, makeCommand("F", 3));
		registerCommand(0, makeCommand("B", -1));
		registerCommand(0, makeCommand("C", 0));
		registerCommand(0, makeCommand("E", 2));
		registerCommand(0, makeCommand("A", -2));

		expect(getCommands(0, { mouse: "left" }).map((c) => c.name)).toEqual([
			"Command F",
			"Command E",
			"Command D",
			"Command C",
			"Command B",
			"Command A",
		]);
	});
});
