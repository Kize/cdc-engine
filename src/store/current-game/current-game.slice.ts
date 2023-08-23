import { Player } from '../../../lib/player.ts';
import { GameEvent } from '../../../lib/history/history-helper.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNewGameId } from '../../../lib/game/game-handler.ts';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner.ts';

export interface CurrentGameState {
  id: string;
  startDate: string;
  players: Array<Player>;
  events: Array<GameEvent>;
  rulesConfiguration: RulesConfiguration;
}

export const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    addEvent: (state, event: PayloadAction<GameEvent>) => {
      state.events.push(event.payload);
    },
    setEvents: (state, action: PayloadAction<Array<GameEvent>>) => {
      state.events = action.payload;
    },
    addPlayer: (state, action: PayloadAction<string>) => {
      state.players.push(action.payload);
    },
    setPlayers: (state, action: PayloadAction<Array<string>>) => {
      state.players = [...action.payload];
    },
    setRulesConfiguration: (
      state,
      action: PayloadAction<RulesConfiguration>,
    ) => {
      state.rulesConfiguration = { ...action.payload };
    },
  },
});

export const {
  addEvent: addEventAction,
  setEvents: setEventsAction,
  addPlayer: addPlayerAction,
  setPlayers: setPlayersAction,
} = currentGameSlice.actions;

export const currentGameReducer = currentGameSlice.reducer;

function initialState(): CurrentGameState {
  const defaultNewState: CurrentGameState = {
    id: getNewGameId(),
    startDate: new Date().toISOString(),
    players: [],
    events: [],
    rulesConfiguration: {
      isSouffletteEnabled: true,
      isSiropEnabled: true,
      isAttrapeOiseauEnabled: true,
      isCivetEnabled: true,
      isArtichetteEnabled: true,
      isVerdierEnabled: true,
      isBleuRougeEnabled: true,
    },
  };

  try {
    const stateString = localStorage.getItem('currentGame');
    if (stateString === null) {
      return defaultNewState;
    }

    return JSON.parse(stateString) as CurrentGameState;
  } catch (_) {
    return defaultNewState;
  }
}
