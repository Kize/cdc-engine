import type { AddOperationLinesContext } from "../../../lib/game/add-operations.ts";
import type { ChanteSloubiGameContext } from "../../../lib/game/game-handler.ts";
import type { Player } from "../../../lib/player.ts";
import { GameContextEvent } from "../../../lib/rule-runner/game-context-event.ts";
import type {
	CivetGameContext,
	DiceRollGameContext,
	VerdierGameContext,
} from "../../../lib/rule-runner/game-context.ts";
import { cdcGameHandler } from "../../utils/game-handler-configuration.ts";
import { resolversSlice } from "../resolvers/resolvers.slice.ts";
import type { AppThunk, AsyncAppThunk } from "../store.ts";
import { currentGameSlice } from "./current-game.slice.ts";

export const applyBevueThunk =
	(player: Player): AsyncAppThunk =>
	async (dispatch) => {
		const gameEvent = await cdcGameHandler.applyBevue(player);

		dispatch(currentGameSlice.actions.addEvent(gameEvent));
	};

type PlayTurnExternalContext =
	| Omit<DiceRollGameContext, "player" | "runner">
	| Omit<CivetGameContext, "player" | "runner">
	| Omit<VerdierGameContext, "player" | "runner">;

export const playATurnThunk =
	(context: PlayTurnExternalContext): AsyncAppThunk =>
	async (dispatch, getState) => {
		const { currentGame } = getState();
		const currentPlayer = cdcGameHandler.getCurrentPlayer(
			currentGame.events,
			currentGame.players,
		);

		try {
			const gameEvent = await cdcGameHandler.playATurn({
				...context,
				runner: cdcGameHandler.ruleRunner,
				player: currentPlayer,
			});

			dispatch(currentGameSlice.actions.addEvent(gameEvent));
		} catch (error) {
			if (error !== undefined) {
				throw error;
			}
		}
	};

export const startGrelottineChallengeThunk =
	(): AsyncAppThunk => async (dispatch) => {
		try {
			const gameEvent = await cdcGameHandler.startGrelottineChallenge({
				event: GameContextEvent.CHALLENGE_GRELOTTINE,
				runner: cdcGameHandler.ruleRunner,
			});

			dispatch(currentGameSlice.actions.addEvent(gameEvent));
		} catch (error) {
			if (error !== undefined) {
				throw error;
			}
		}
	};

export const cancelLastEventThunk = (): AppThunk => (dispatch, getState) => {
	const events = [...getState().currentGame.events];

	events.pop();

	dispatch(currentGameSlice.actions.setEvents(events));
};

export const addPlayerWithChanteSloubiThunk =
	(context: ChanteSloubiGameContext): AppThunk =>
	(dispatch, getState) => {
		const inGamePlayers = getState().currentGame.players;
		if (inGamePlayers.length > 7) {
			console.error("Sloubi canceled, Too many players already.");
			return;
		}

		const gameEvent = cdcGameHandler.singSloubi(
			context,
			getState().currentGame.events,
			inGamePlayers,
		);

		const { sloubiPlayer, previousPlayer } = context;

		const players = inGamePlayers.reduce((acc: Array<Player>, player) => {
			acc.push(player, ...(player === previousPlayer ? [sloubiPlayer] : []));

			return acc;
		}, []);

		dispatch(currentGameSlice.actions.setPlayers(players));
		dispatch(currentGameSlice.actions.addEvent(gameEvent));
		dispatch(resolversSlice.actions.setChanteSloubi({ active: false }));
	};

export const addOperationsThunk =
	(context: AddOperationLinesContext): AppThunk =>
	(dispatch, getState) => {
		if (context.operations.length > 0) {
			const { events, players } = getState().currentGame;
			const gameEvent = cdcGameHandler.addOperations(context, events, players);

			dispatch(currentGameSlice.actions.addEvent(gameEvent));
		}

		dispatch(resolversSlice.actions.setAddOperations({ active: false }));
	};
