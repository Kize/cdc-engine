import { createListenerMiddleware } from '@reduxjs/toolkit';
import { RootState } from './store.ts';

export const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  predicate: (_, currentState, previousState) =>
    JSON.stringify((currentState as RootState).currentGame) !==
    JSON.stringify((previousState as RootState).currentGame),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    localStorage.setItem('currentGame', JSON.stringify(state.currentGame));
  },
});
