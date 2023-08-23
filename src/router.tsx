import { createBrowserRouter, redirect } from 'react-router-dom';
import { CreateNewGame } from './pages/create-new-game/CreateNewGame.tsx';
import { ScribePanel } from './pages/scribe-panel/ScribePanel.tsx';
import { store } from './store/store.ts';
import {
  cdcGameHandler,
  configureGameHandlerRules,
} from './utils/game-handler-configuration.ts';
import { GameStatus } from '../lib/game/game-handler.ts';
import { currentGameSlice } from './store/current-game/current-game.slice.ts';
import { persistGameToLocalStorage } from './utils/persist-game-to-local-storage.ts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateNewGame />,
    loader: createNewGameLoader,
  },
  {
    path: '/scribe-panel',
    element: <ScribePanel />,
    loader: scribePanelLoader,
  },
]);

function createNewGameLoader() {
  console.log('loading create');
  const { currentGame } = store.getState();

  const gameStatus = cdcGameHandler.getGameStatus(
    currentGame.events,
    currentGame.players,
  );

  switch (gameStatus) {
    case GameStatus.IN_GAME:
      console.log('redirect scribe', gameStatus);
      return redirect('/scribe-panel');
    case GameStatus.FINISHED:
      persistGameToLocalStorage(currentGame);
      store.dispatch(currentGameSlice.actions.resetGame());
  }

  return null;
}

function scribePanelLoader() {
  console.log('loading scribe');
  const { currentGame } = store.getState();

  configureGameHandlerRules(currentGame.rulesConfiguration);

  const gameStatus = cdcGameHandler.getGameStatus(
    currentGame.events,
    currentGame.players,
  );

  console.log(currentGame, gameStatus);

  switch (gameStatus) {
    case GameStatus.CREATION:
    case GameStatus.FINISHED:
      console.log('redirect create', gameStatus);
      return redirect('/');
  }

  return null;
}
