import { AsyncAppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  currentGameSlice,
  getNewCurrentGameState,
} from './current-game.slice.ts';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';
import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';
import { router } from '../../router.tsx';

export const applyBevueThunk =
  (player: Player): AsyncAppThunk =>
  async (dispatch) => {
    const gameEvent = await cdcGameHandler.applyBevue(player);

    dispatch(currentGameSlice.actions.addEvent(gameEvent));
  };

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
