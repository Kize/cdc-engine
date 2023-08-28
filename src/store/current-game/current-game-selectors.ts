import { RootState } from '../store.ts';
import { createSelector } from '@reduxjs/toolkit';

import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';
import { PlayerCardDetails } from '../../pages/scribe-panel/PlayerCard.tsx';
import {
  GameLineType,
  historyLineToMessage,
} from '../../../lib/history/history-line.ts';
import { RuleEffectEvent } from '../../../lib/rule-runner/rules/rule-effect.ts';

export const selectPlayers = (state: RootState) => state.currentGame.players;
export const selectEvents = (state: RootState) => state.currentGame.events;
export const selectRulesConfiguration = (state: RootState) =>
  state.currentGame.rulesConfiguration;

export const selectPlayerCardDetails = createSelector(
  selectPlayers,
  selectEvents,
  (players, events) =>
    players.map<PlayerCardDetails>((player) => ({
      player,
      score: cdcGameHandler.history.getPlayerScore(events, player),
      isCurrentPlayer:
        cdcGameHandler.getCurrentPlayer(events, players) === player,
      hasGrelottine: cdcGameHandler.history.hasGrelottine(events, player),
    })),
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
