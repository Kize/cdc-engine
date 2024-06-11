import type { JSX } from "react";
import { DoubletteModePlayerCards } from "../../../components/player-cards/DoubletteModePlayerCards.tsx";
import { SingleModePlayerCards } from "../../../components/player-cards/SingleModePlayerCards.tsx";
import { useAppSelector } from "../../../store/store.ts";

export function PlayerDetailsSummary(): JSX.Element {
	const isDoublette = useAppSelector((state) => state.currentGame.isDoublette);

	return (
		<>
			{!isDoublette && <SingleModePlayerCards />}
			{isDoublette && <DoubletteModePlayerCards />}
		</>
	);
}
