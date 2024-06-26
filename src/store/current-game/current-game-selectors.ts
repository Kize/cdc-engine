import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store.ts";

import type { GameStatus } from "../../../lib/game/game-handler.ts";
import {
	GameLineType,
	historyLineToMessage,
} from "../../../lib/history/history-line.ts";
import type { Player } from "../../../lib/player.ts";
import { RuleEffectEvent } from "../../../lib/rule-runner/rules/rule-effect.ts";
import type { PlayerCardDetails } from "../../components/player-cards/player-card-details.ts";
import type { PlayerWithSumScores } from "../../pages/scribe-panel/modals/EndGameModal.tsx";
import { cdcGameHandler } from "../../utils/game-handler-configuration.ts";

export const selectPlayers = (state: RootState) => state.currentGame.players;
export const selectEvents = (state: RootState) => state.currentGame.events;
export const selectRulesConfiguration = (state: RootState) =>
	state.currentGame.rulesConfiguration;
export const selectIsDoublette = (state: RootState) =>
	state.currentGame.isDoublette;

export const selectGameStatus = createSelector(
	selectPlayers,
	selectEvents,
	selectIsDoublette,
	(players, events, isDoublette): GameStatus =>
		cdcGameHandler.getGameStatus(events, players, isDoublette),
);

export const selectPlayerCardDetails = createSelector(
	selectPlayers,
	selectEvents,
	selectRulesConfiguration,
	(players: Array<Player>, events, rules) =>
		players.map<PlayerCardDetails>((player) => ({
			player,
			score: cdcGameHandler.history.getPlayerScore(events, player),
			isCurrentPlayer:
				cdcGameHandler.getCurrentPlayer(events, players) === player,
			hasGrelottine: cdcGameHandler.history.hasGrelottine(events, player),
			hasCivet:
				rules.isCivetEnabled && cdcGameHandler.history.hasCivet(events, player),
		})),
);

export const selectPlayersWithSumScores = createSelector(
	selectPlayers,
	selectEvents,
	(players: Array<Player>, events) =>
		players
			.map<PlayerWithSumScores>((player) => ({
				player,
				score: cdcGameHandler.history.getPlayerScore(events, player),
				positiveScore: cdcGameHandler.history.getPlayerPositiveSumScore(
					events,
					player,
				),
				negativeScore: cdcGameHandler.history.getPlayerNegativeSumScore(
					events,
					player,
				),
			}))
			.sort((a, b) => (a.score < b.score ? 1 : -1)),
);

export const selectNumberOfTurns = createSelector(
	selectPlayers,
	selectEvents,
	(players, events) => cdcGameHandler.getNumberOfTurns(events, players),
);

export const selectLastEventMessage = createSelector(
	selectEvents,
	(events): Array<string> => {
		const lastEvent = events.at(-1);

		if (!lastEvent) {
			return [];
		}

		return lastEvent.historyLines
			.filter(
				(line) =>
					line.designation !== GameLineType.PLAY_TURN &&
					line.designation !== RuleEffectEvent.ADD_GRELOTTINE,
			)
			.map(historyLineToMessage);
	},
);

export const selectSloubiScore = createSelector(
	selectPlayerCardDetails,
	selectNumberOfTurns,
	(details: Array<PlayerCardDetails>, turnNumber: number) => {
		const [bestScore, secondBestScore] = details
			.map((details) => details.score)
			.sort((score1, score2) => score2 - score1)
			.slice(0, 2);

		return Math.floor(((bestScore - secondBestScore) * turnNumber) / 10);
	},
);
