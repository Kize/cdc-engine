import { RootState } from '../store.ts';
import { createSelector } from '@reduxjs/toolkit';

import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';
import { PlayerCardDetails } from '../../pages/scribe-panel/PlayerCard.tsx';

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
