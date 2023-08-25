import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../../lib/player.ts';

export interface ResolversState {
  grelottine: {
    active: boolean;
  };
  suite: { active: boolean; player: Player };
  chouetteVelute: { active: boolean; player: Player };
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
  };
}

export const resolversSlice = createSlice({
  name: 'resolvers',
  initialState,
  reducers: {
    setGrelottine: (
      state,
      action: PayloadAction<ResolversState['grelottine']>,
    ) => {
      state.grelottine = action.payload;
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
