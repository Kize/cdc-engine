import { GameHandler } from '../../../lib/game/game-handler.ts';
import { AppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  addEventAction,
  setEventsAction,
  setPlayersAction,
} from './current-game.slice.ts';
import { BevueRule } from '../../../lib/rule-runner/rules/basic-rules/bevue-rule.ts';
import { NeantRule } from '../../../lib/rule-runner/rules/basic-rules/neant-rule.ts';

export const gameHandler = new GameHandler();

//TODO: really handle rules
const defaultRules = [new BevueRule(), new NeantRule()];
gameHandler.setRules(defaultRules);

export const applyBevueThunk =
  (player: Player): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const gameEvent = await gameHandler.applyBevue(player);

    dispatch(addEventAction(gameEvent));
  };

export const resetGameThunk = (): AppThunk => (dispatch) => {
  dispatch(setPlayersAction([]));
  dispatch(setEventsAction([]));
  gameHandler.setRules(defaultRules);
};
