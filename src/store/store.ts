import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { currentGameSlice } from './current-game/current-game.slice.ts';
import { localStorageMiddleware } from './local-storage.middleware.ts';
import { resolversSlice } from './resolvers/resolvers.slice.ts';

export const store = configureStore({
  reducer: {
    currentGame: currentGameSlice.reducer,
    resolvers: resolversSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});

type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AsyncAppThunk = AppThunk<Promise<void>>;
