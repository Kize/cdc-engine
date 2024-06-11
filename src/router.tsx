import { createBrowserRouter, redirect } from "react-router-dom";
import { GameStatus } from "../lib/game/game-handler.ts";
import { CreateNewGame } from "./pages/create-new-game/CreateNewGame.tsx";
import { CurrentGameHistory } from "./pages/current-game-history/CurrentGameHistory.tsx";
import { ScribePanel } from "./pages/scribe-panel/ScribePanel.tsx";
import { currentGameSlice } from "./store/current-game/current-game.slice.ts";
import { store } from "./store/store.ts";
import {
	cdcGameHandler,
	configureGameHandlerRules,
} from "./utils/game-handler-configuration.ts";
import { persistGameToLocalStorage } from "./utils/persist-game-to-local-storage.ts";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <CreateNewGame />,
		loader: createNewGameLoader,
	},
	{
		path: "/scribe-panel",
		element: <ScribePanel />,
		loader: scribePanelLoader,
	},
	{
		path: "/history",
		element: <CurrentGameHistory />,
		loader: historyLoader,
	},
]);

function createNewGameLoader() {
	const { currentGame } = store.getState();

	const gameStatus = cdcGameHandler.getGameStatus(
		currentGame.events,
		currentGame.players,
		currentGame.isDoublette,
	);

	switch (gameStatus) {
		case GameStatus.IN_GAME:
			return redirect("/scribe-panel");
		case GameStatus.FINISHED:
			persistGameToLocalStorage(currentGame);
	}

	store.dispatch(currentGameSlice.actions.resetGame());
	return null;
}

function scribePanelLoader() {
	const { currentGame } = store.getState();

	configureGameHandlerRules(currentGame.rulesConfiguration);

	const gameStatus = cdcGameHandler.getGameStatus(
		currentGame.events,
		currentGame.players,
		currentGame.isDoublette,
	);

	switch (gameStatus) {
		case GameStatus.CREATION:
			return redirect("/");
	}

	return null;
}

function historyLoader() {
	const { currentGame } = store.getState();
	configureGameHandlerRules(currentGame.rulesConfiguration);

	const gameStatus = cdcGameHandler.getGameStatus(
		currentGame.events,
		currentGame.players,
		currentGame.isDoublette,
	);

	switch (gameStatus) {
		case GameStatus.CREATION:
			return redirect("/");
	}

	return null;
}
