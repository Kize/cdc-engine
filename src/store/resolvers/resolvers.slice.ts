import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../../lib/player.ts';

export interface ResolversState {
  grelottine: {
    active: boolean;
  };
  suite: { active: boolean; player: Player };
  chouetteVelute: { active: boolean; player: Player };
  chanteSloubi: { active: boolean };
}

function initialState(): ResolversState {
  return {
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
    chanteSloubi: { active: false },
  };
}

export const resolversSlice = createSlice({
  name: 'resolvers',
  initialState,
  reducers: {
    setChanteSloubi: (
      state,
      { payload }: PayloadAction<ResolversState['chanteSloubi']>,
    ) => {
      state.chanteSloubi = payload;
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
      { payload }: PayloadAction<ResolversState['suite']>,
    ) => {
      state.chouetteVelute = payload;
    },
  },
});
