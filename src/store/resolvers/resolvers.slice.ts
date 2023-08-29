import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../../lib/player.ts';

export interface ResolversState {
  addOperations: { active: boolean };
  chanteSloubi: { active: boolean };
  endGame: { active: boolean };

  grelottine: {
    active: boolean;
  };
  suite: { active: boolean; player: Player };
  chouetteVelute: { active: boolean; player: Player };
  soufflette: { active: boolean; player: Player };
  artichette: { active: boolean; player: Player };
}

function initialState(): ResolversState {
  return {
    chanteSloubi: { active: false },
    addOperations: { active: false },
    endGame: { active: false },
    grelottine: {
      active: false,
    },
    suite: {
      active: false,
      player: '',
    },
    chouetteVelute: {
      active: false,
      player: '',
    },
    soufflette: {
      active: false,
      player: '',
    },
    artichette: {
      active: false,
      player: '',
    },
  };
}

export const resolversSlice = createSlice({
  name: 'resolvers',
  initialState,
  reducers: {
    setAddOperations: (
      state,
      { payload }: PayloadAction<ResolversState['addOperations']>,
    ) => {
      state.addOperations = payload;
    },
    setChanteSloubi: (
      state,
      { payload }: PayloadAction<ResolversState['chanteSloubi']>,
    ) => {
      state.chanteSloubi = payload;
    },
    setEndGame: (
      state,
      { payload }: PayloadAction<ResolversState['endGame']>,
    ) => {
      state.endGame = payload;
    },
    setGrelottine: (
      state,
      { payload }: PayloadAction<ResolversState['grelottine']>,
    ) => {
      state.grelottine = payload;
    },
    setSuite: (state, { payload }: PayloadAction<ResolversState['suite']>) => {
      state.suite = { ...payload };
    },
    setChouetteVelute: (
      state,
      { payload }: PayloadAction<ResolversState['chouetteVelute']>,
    ) => {
      state.chouetteVelute = payload;
    },
    setSoufflette: (
      state,
      { payload }: PayloadAction<ResolversState['soufflette']>,
    ) => {
      state.soufflette = payload;
    },
    setArtichette: (
      state,
      { payload }: PayloadAction<ResolversState['artichette']>,
    ) => {
      state.artichette = payload;
    },
  },
});
