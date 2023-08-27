import { AppThunk, AsyncAppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  currentGameSlice,
  getNewCurrentGameState,
} from './current-game.slice.ts';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';
import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';
import { router } from '../../router.tsx';
import { DiceRoll } from '../../../lib/rule-runner/rules/dice-rule.ts';
import { GameContextEvent } from '../../../lib/rule-runner/game-context-event.ts';
import { resolversSlice } from '../resolvers/resolvers.slice.ts';
import { ChanteSloubiGameContext } from '../../../lib/game/game-handler.ts';

export const startGameThunk =
  (
    players: Array<Player>,
    rulesConfiguration: RulesConfiguration,
  ): AsyncAppThunk =>
  async (dispatch) => {
    const newGame = getNewCurrentGameState();
    newGame.players = [...players];
    newGame.rulesConfiguration = { ...rulesConfiguration };

    dispatch(currentGameSlice.actions.startGame(newGame));

    await router.navigate('/scribe-panel');
  };

export const resetGameThunk = (): AsyncAppThunk => async (dispatch) => {
  dispatch(currentGameSlice.actions.resetGame());
  await router.navigate('/');
};

export const applyBevueThunk =
  (player: Player): AsyncAppThunk =>
  async (dispatch) => {
    const gameEvent = await cdcGameHandler.applyBevue(player);

    dispatch(currentGameSlice.actions.addEvent(gameEvent));
  };

export const playATurnThunk =
  (diceRoll: DiceRoll): AsyncAppThunk =>
  async (dispatch, getState) => {
    const { currentGame } = getState();
    const currentPlayer = cdcGameHandler.getCurrentPlayer(
      currentGame.events,
      currentGame.players,
    );

    try {
      const gameEvent = await cdcGameHandler.playATurn({
        event: GameContextEvent.DICE_ROLL,
        diceRoll,
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
      console.error('Sloubi canceled, Too many players already.');
      return;
    }

    const gameEvent = cdcGameHandler.singSloubi(
      context,
      getState().currentGame.events,
      inGamePlayers,
    );

    const { sloubiPlayer, previousPlayer } = context;

    const players = inGamePlayers.reduce(
      (acc: Array<Player>, player) => [
        ...acc,
        player,
        ...(player === previousPlayer ? [sloubiPlayer] : []),
      ],
      [],
    );

    dispatch(currentGameSlice.actions.setPlayers(players));
    dispatch(currentGameSlice.actions.addEvent(gameEvent));
    dispatch(resolversSlice.actions.setChanteSloubi({ active: false }));
  };
