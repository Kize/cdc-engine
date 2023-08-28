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

export const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    startGame: (state, { payload }: PayloadAction<CurrentGameState>) => {
      state.id = payload.id;
      state.startDate = payload.startDate;
      state.players = payload.players;
      state.events = payload.events;
      state.rulesConfiguration = payload.rulesConfiguration;
    },
    resetGame: (state) => {
      const newState = getNewCurrentGameState();
      state.id = newState.id;
      state.startDate = newState.startDate;
      state.players = newState.players;
      state.events = newState.events;
      state.rulesConfiguration = newState.rulesConfiguration;
    },
    addEvent: (state, { payload }: PayloadAction<GameEvent>) => {
      state.events.push(payload);
    },
    setEvents: (state, { payload }: PayloadAction<Array<GameEvent>>) => {
      state.events = payload;
    },
    setPlayers: (state, { payload }: PayloadAction<Array<string>>) => {
      state.players = [...payload];
    },
    setRulesConfiguration: (
      state,
      { payload }: PayloadAction<RulesConfiguration>,
    ) => {
      state.rulesConfiguration = { ...payload };
    },
  },
});

export function getNewCurrentGameState(): CurrentGameState {
  return {
    id: getNewGameId(),
    startDate: new Date().toISOString(),
    players: [],
    events: [],
    rulesConfiguration: {
      isSouffletteEnabled: true,
      isSiropEnabled: false,
      isAttrapeOiseauEnabled: false,
      isCivetEnabled: false,
      isArtichetteEnabled: true,
      isVerdierEnabled: false,
      isBleuRougeEnabled: false,
    },
  };
}

function initialState(): CurrentGameState {
  try {
    const stateString = localStorage.getItem('currentGame');
    if (stateString === null) {
      return getNewCurrentGameState();
    }

    return JSON.parse(stateString) as CurrentGameState;
  } catch (_) {
    return getNewCurrentGameState();
  }
}
