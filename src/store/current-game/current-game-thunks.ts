import { GameHandler } from '../../../lib/game/game-handler.ts';
import { AppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  addEventAction,
  setEventsAction,
  setPlayersAction,
} from './current-game.slice.ts';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';

export const cdcGameHandler = new GameHandler();

export const applyBevueThunk =
  (player: Player): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const gameEvent = await cdcGameHandler.applyBevue(player);

    dispatch(addEventAction(gameEvent));
  };

export const resetGameThunk = (): AppThunk => (dispatch) => {
  dispatch(setPlayersAction([]));
  dispatch(setEventsAction([]));
};

export const startGameThunk =
  (players: Array<Player>, rulesConfiguration: RulesConfiguration): AppThunk =>
  (dispatch) => {
    dispatch(setPlayersAction(players));
    dispatch(setEventsAction([]));
  };
