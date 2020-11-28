import {
	addScriptHook,
	Camera,
	Timer,
	TimerDialog,
	Unit,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { heroTypes } from "../types";
import { forEachPlayer } from "../util";
import { advanceToGrindState } from "./grind";
import { setGlobalState, state } from "./state";

const tempUnits: Unit[] = [];

const advanceFromHeroSelection = () => {
	if (state.state !== "hero-selection") return;

	state.heroSelection.timer.destroy();
	state.heroSelection.timerDialog.destroy();

	const heroes: Unit[] = [];

	// Spawn heroes
	forEachPlayer((player) => {
		if (state.state !== "hero-selection") return;

		const heroType = state.heroSelection.selections[player.id];
		const u = new Unit(player, heroType, 0, 0, 270);
		heroes[player.id] = u;

		// Disables moving the camera and auto-follows the hero
		if (player.handle === GetLocalPlayer())
			Camera.setTargetController(u.handle, 0, 128, false);
	});

	// Reset camera
	Camera.setField(CAMERA_FIELD_ANGLE_OF_ATTACK, 304, 0);
	Camera.setField(CAMERA_FIELD_TARGET_DISTANCE, 1650, 0);
	Camera.setField(CAMERA_FIELD_FIELD_OF_VIEW, 70, 0);

	tempUnits.forEach((u) => u.destroy());
	tempUnits.splice(0);

	advanceToGrindState(heroes);
};

const spawnHeroOptions = () => {
	const theoreticalCount = 24;
	const angleDelta = 360 / theoreticalCount;
	const startingAngle = 90 + angleDelta * ((heroTypes.length - 1) / 2);
	const distance = 450;
	for (let i = 0; i < heroTypes.length; i++) {
		const angle = startingAngle - angleDelta * i;
		const u = new Unit(
			PLAYER_NEUTRAL_PASSIVE,
			heroTypes[i],
			distance * CosBJ(angle),
			distance * SinBJ(angle),
			angle + 180,
		);
		u.setScale(1.25, 1.25, 1.25);
		tempUnits.push(u);
	}
};

const spawnWisps = () => {
	forEachPlayer((player) => {
		const u = new Unit(player, FourCC("e000"), 0, 0, 270);
		u.x = 0;
		u.y = 0;
		tempUnits.push(u);

		// Disables moving the camera
		if (player.handle === GetLocalPlayer())
			Camera.setTargetController(u.handle, 0, 384, false);
	});

	// Camp fire camera
	Camera.setField(CAMERA_FIELD_ANGLE_OF_ATTACK, 345, 0);
	Camera.setField(CAMERA_FIELD_TARGET_DISTANCE, 1000, 0);
	Camera.setField(CAMERA_FIELD_FIELD_OF_VIEW, 60, 0);
};

const advanceToHeroSelection = () => {
	spawnHeroOptions();
	spawnWisps();
	const timer = new Timer();
	const timerDialog = new TimerDialog(timer);
	timerDialog.setTitle("Time to pick...");
	timer.start(60, false, () => {
		if (state.state === "hero-selection") state.heroSelection.advance();
	});
	timerDialog.display = true;
	setGlobalState({
		state: "hero-selection",
		heroSelection: {
			selections: [],
			advance: advanceFromHeroSelection,
			timer,
			timerDialog,
		},
	});
};

addScriptHook(W3TS_HOOK.MAIN_AFTER, () => {
	new Timer().start(0.25, false, () => {
		Timer.fromExpired().destroy();
		advanceToHeroSelection();
	});
});
