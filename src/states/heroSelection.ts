import {
	addScriptHook,
	Camera,
	Timer,
	TimerDialog,
	W3TS_HOOK,
} from "../../node_modules/w3ts/index";
import { fireboltSkill } from "../skills/sorceress/fire/firebolt";
import { Hero } from "../units/Hero";
import { heroData, heroDataArr } from "../units/heroTypes";
import { UnitEx } from "../units/UnitEx";
import { forEachPlayer } from "../util";
import { advanceToGrindState } from "./grind";
import { setGlobalState, state } from "./state";

const tempUnits: UnitEx[] = [];

const advanceFromHeroSelection = () => {
	if (state.state !== "hero-selection") return;

	state.heroSelection.timer.destroy();
	state.heroSelection.timerDialog.destroy();

	const heroes: Hero[] = [];

	// Spawn heroes
	forEachPlayer((player) => {
		if (state.state !== "hero-selection") return;

		const heroType = state.heroSelection.selections[player.id];
		const hero = new Hero({
			owner: player,
			unit: heroData[heroType].type,
			x: 0,
			y: 0,
			...heroData[heroType].initial,
		});
		heroes[player.id] = hero;

		// Disables moving the camera and auto-follows the hero
		if (player.handle === GetLocalPlayer())
			Camera.setTargetController(hero.handle, 0, 128, false);

		if (heroType === "sorceress") hero.addSkill(fireboltSkill());
	});

	// Reset camera
	Camera.setField(CAMERA_FIELD_ANGLE_OF_ATTACK, 304, 0);
	Camera.setField(CAMERA_FIELD_TARGET_DISTANCE, 1650, 0);
	Camera.setField(CAMERA_FIELD_FIELD_OF_VIEW, 70, 0);

	tempUnits.forEach((u) => u.unit.destroy());
	tempUnits.splice(0);

	advanceToGrindState(heroes);
};

const spawnHeroOptions = () => {
	const theoreticalCount = 24;
	const angleDelta = 360 / theoreticalCount;
	const startingAngle = 90 + angleDelta * ((heroDataArr.length - 1) / 2);
	const distance = 450;
	for (let i = 0; i < heroDataArr.length; i++) {
		const angle = startingAngle - angleDelta * i;
		const u = new UnitEx({
			owner: PLAYER_NEUTRAL_PASSIVE,
			unit: heroDataArr[i].type,
			x: distance * CosBJ(angle),
			y: distance * SinBJ(angle),
			facing: angle + 180,
			level: -1,
		});
		u.unit.setScale(1.25, 1.25, 1.25);
		u.unit.moveSpeed = 0;
		tempUnits.push(u);
	}
};

const spawnWisps = () => {
	forEachPlayer((player) => {
		const u = new UnitEx({
			owner: player,
			unit: "e000",
			x: 0,
			y: 0,
			level: -1,
		});
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
