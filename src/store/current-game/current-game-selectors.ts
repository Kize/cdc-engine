import { RootState } from '../store.ts';
import { createSelector } from '@reduxjs/toolkit';
import { gameHandler } from './current-game-thunks.ts';

export const selectPlayers = (state: RootState) => state.currentGame.players;
export const selectEvents = (state: RootState) => state.currentGame.events;
export const selectRulesConfiguration = (state: RootState) =>
  state.currentGame.rulesConfiguration;

export const selectPlayersWithScore = createSelector(
  selectPlayers,
  selectEvents,
  (players, events) =>
    players.map((player) => ({
      name: player,
      score: gameHandler.history.getPlayerScore(events, player),
    })),
);
