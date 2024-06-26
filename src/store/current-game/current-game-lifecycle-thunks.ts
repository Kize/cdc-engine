import type { Player } from "../../../lib/player.ts";
import type { RulesConfiguration } from "../../../lib/rule-runner/rule-runner-configuration.ts";
import { router } from "../../router.tsx";
import type { AsyncAppThunk } from "../store.ts";
import {
	currentGameSlice,
	getNewCurrentGameState,
} from "./current-game.slice.ts";

export const startGameThunk =
	(
		isDoublette: boolean,
		players: Array<Player>,
		rulesConfiguration: RulesConfiguration,
	): AsyncAppThunk =>
	async (dispatch) => {
		const newGame = getNewCurrentGameState();
		newGame.isDoublette = isDoublette;
		newGame.players = [...players];
		newGame.rulesConfiguration = { ...rulesConfiguration };

		dispatch(currentGameSlice.actions.startGame(newGame));

		await router.navigate("/scribe-panel");
	};

export const resetGameThunk = (): AsyncAppThunk => async (dispatch) => {
	dispatch(currentGameSlice.actions.resetGame());
	await router.navigate("/");
};
