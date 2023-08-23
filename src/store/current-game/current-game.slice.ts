import { Player } from '../../../lib/player.ts';
import { GameEvent } from '../../../lib/history/history-helper.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNewGameId } from '../../../lib/game/game-handler.ts';

import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';

export interface CurrentGameState {
  id: string;
  startDate: string;
  players: Array<Player>;
  events: Array<GameEvent>;
  rulesConfiguration: RulesConfiguration;
}

const defaultNewState: CurrentGameState = {
  id: getNewGameId(),
  startDate: new Date().toISOString(),
  players: [],
  events: [],
  rulesConfiguration: {
    isSouffletteEnabled: false,
    isSiropEnabled: false,
    isAttrapeOiseauEnabled: false,
    isCivetEnabled: false,
    isArtichetteEnabled: false,
    isVerdierEnabled: false,
    isBleuRougeEnabled: false,
  },
};

export const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    resetGame: (state) => {
      const newState = { ...defaultNewState };
      state.id = newState.id;
      state.startDate = newState.startDate;
      state.players = newState.players;
      state.events = newState.events;
      state.rulesConfiguration = newState.rulesConfiguration;
    },
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

export const currentGameReducer = currentGameSlice.reducer;

export const {
  addEvent: addEventAction,
  setEvents: setEventsAction,
  addPlayer: addPlayerAction,
  setPlayers: setPlayersAction,
} = currentGameSlice.actions;

function initialState(): CurrentGameState {
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
