import { Player } from '../../../lib/player.ts';

export interface PlayerCardDetails {
  player: Player;
  score: number;
  isCurrentPlayer: boolean;
  hasGrelottine: boolean;
  hasCivet: boolean;
}
