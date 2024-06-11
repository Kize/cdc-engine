import { createSelector } from "@reduxjs/toolkit";
import {
	selectIsDoublette,
	selectPlayerCardDetails,
} from "../../store/current-game/current-game-selectors.ts";
import type { PlayerCardDetails } from "./player-card-details.ts";

export interface Team {
	score: number;
	firstPlayer: PlayerCardDetails;
	secondPlayer: PlayerCardDetails;
}

export const selectDoubletteTeams = createSelector(
	selectPlayerCardDetails,
	selectIsDoublette,
	(
		playerDetails: Array<PlayerCardDetails>,
		isDoublette: boolean,
	): Array<Team> => {
		if (!isDoublette) {
			return [];
		}

		const half = playerDetails.length / 2;

		return playerDetails.reduce<Array<Team>>((allTeams, player, index) => {
			if (index >= half) {
				return allTeams;
			}

			const secondPlayer = playerDetails.at(index + half);
			if (!secondPlayer) {
				throw new Error("Error will building doublette teams");
			}

			allTeams.push({
				firstPlayer: player,
				secondPlayer,
				score: player.score + secondPlayer.score,
			});

			return allTeams;
		}, []);
	},
);
