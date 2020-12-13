import * as React from "w3ts-jsx";

import { Hero, levelToExperience } from "../../units/Hero";
import { Tooltip } from "../components/Tooltip";
import { useRefState } from "../hooks/useRefState";
import { useUnitListener } from "../hooks/useUnitListener";
import { leftToRight, parent, topLeft } from "../util/pos";

const ICON_SIZE = 48;

const ButtonIcon = ({
	icon,
	tooltip,
	onClick,
	first = false,
}: {
	icon: string;
	tooltip?: string;
	onClick: () => void;
	first?: boolean;
}) => {
	const buttonRef = useRefState<framehandle | null>(null);
	return (
		<button
			position={first ? topLeft() : leftToRight()}
			size={{ width: ICON_SIZE, height: ICON_SIZE }}
			ref={buttonRef}
			onClick={onClick}
			tooltip={
				tooltip && (
					<Tooltip>
						<text
							text={tooltip}
							position={{
								point: FRAMEPOINT_BOTTOM,
								relative: buttonRef.current ?? "parent",
								relativePoint: FRAMEPOINT_TOP,
								y: 24,
							}}
						/>
					</Tooltip>
				)
			}
		>
			<backdrop texture={icon} position="parent" />
		</button>
	);
};

const Menu = ({
	toggleAttributesVisibile,
}: {
	toggleAttributesVisibile: () => void;
}) => (
	<container
		absPosition={{
			point: FRAMEPOINT_TOPLEFT,
			x: 1200,
			y: ICON_SIZE,
		}}
		size={{ height: ICON_SIZE, width: 300 }}
	>
		<ButtonIcon
			icon="assets/img/Player_eq_icon_r"
			tooltip="Character"
			onClick={toggleAttributesVisibile}
			first
		/>
		<ButtonIcon
			icon="assets/img/Bag2_eq_icon_r"
			tooltip="Inventory"
			onClick={() => {
				/* do nothing */
			}}
		/>
		<backdrop texture="asdf" position="parent" alpha={10} />
	</container>
);

const ExperienceBar = ({ hero }: { hero: Hero }) => {
	useUnitListener(hero);
	const experienceToCurrentLevel = levelToExperience(hero.level);
	const experienceToNextLevel = levelToExperience(hero.level + 1);
	const value = hero.experience - experienceToCurrentLevel;
	const max = experienceToNextLevel - experienceToCurrentLevel;
	return (
		<container
			absPosition={{ point: FRAMEPOINT_BOTTOMLEFT, x: 400 }}
			size={{ height: 29, width: 800 }}
			tooltip={
				<Tooltip>
					<text
						absPosition={{
							point: FRAMEPOINT_BOTTOMLEFT,
							x: 700,
							y: 53, // 29 (bar height) + 24 (tooltip border)
						}}
						text={`${Math.round(value)}/${Math.round(
							max,
						)} (${Math.round((value / max) * 100)}%)`}
					/>
				</Tooltip>
			}
		>
			<container
				position={parent({
					padding: { top: 8, horizontal: 40, bottom: 2 },
				})}
			>
				<backdrop texture="textures/black32" position="parent" />
				<backdrop
					texture="assets/img/XP_bar_line"
					position={topLeft()}
					size={{
						height: 19,
						width: 720 * (value / max),
					}}
				/>
			</container>
			<backdrop texture="assets/img/XP_bar" position="parent" />
		</container>
	);
};

export const BottomBar = ({
	toggleAttributesVisibile,
	hero,
}: {
	toggleAttributesVisibile: () => void;
	hero: Hero;
}): React.Node => (
	<>
		<ExperienceBar hero={hero} />
		<Menu toggleAttributesVisibile={toggleAttributesVisibile} />
	</>
);
