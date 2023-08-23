import { AppThunk } from '../store.ts';
import { Player } from '../../../lib/player.ts';
import {
  addEventAction,
  setEventsAction,
  setPlayersAction,
} from './current-game.slice.ts';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';
import {
  cdcGameHandler,
  configureGameHandlerRules,
} from '../../utils/game-handler-configuration.ts';

export const applyBevueThunk =
  (player: Player): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const gameEvent = await cdcGameHandler.applyBevue(player);

    dispatch(addEventAction(gameEvent));
  };

export const startGameThunk =
  (players: Array<Player>, rulesConfiguration: RulesConfiguration): AppThunk =>
  (dispatch) => {
    dispatch(setPlayersAction(players));
    dispatch(setEventsAction([]));

    configureGameHandlerRules(rulesConfiguration);
  };
