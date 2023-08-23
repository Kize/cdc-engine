import { GameHandler } from '../../../lib/game/game-handler.ts';
import { AppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  addEventAction,
  setEventsAction,
  setPlayersAction,
} from './current-game.slice.ts';

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
  cdcGameHandler.setRules([]);
};
