import { AllHistoryLineTypes, GameLineType } from './history-line';
import { Player } from '../player';

interface HistoryLine {
  player: Player;
  designation: AllHistoryLineTypes;
  amount: number;
}

export interface GameEvent {
  id: string;
  historyLines: Array<HistoryLine>;
}

export class HistoryHelper {
  getPlayerScore(events: Array<GameEvent>, player: Player): number {
    return this.getPlayerScoreFromEvents(events, player);
  }

  getPlayerScoreAtEvent(
    events: Array<GameEvent>,
    player: Player,
    eventId: string,
  ): number {
    const index = events.findIndex((event) => event.id === eventId);

    return this.getPlayerScoreFromEvents(events.slice(0, index + 1), player);
  }

  getNumberOfTurnsPlayed(events: Array<GameEvent>, player: Player): number {
    return events.reduce((numberOfTurnsPlayed: number, event) => {
      const numberOfTurnsPlayedInEvent = event.historyLines.reduce(
        (sum: number, line) => {
          if (
            line.player === player &&
            line.designation === GameLineType.PLAY_TURN
          ) {
            return sum + 1;
          }
          return sum;
        },
        0,
      );

      return numberOfTurnsPlayed + numberOfTurnsPlayedInEvent;
    }, 0);
  }

  private getPlayerScoreFromEvents(
    events: Array<GameEvent>,
    player: Player,
  ): number {
    return events.reduce((sum: number, event) => {
      const historyLinesSum = event.historyLines.reduce(
        (subSum: number, line) => {
          if (line.player === player) {
            return subSum + line.amount;
          }
          return subSum;
        },
        0,
      );

      return sum + historyLinesSum;
    }, 0);
  }
}
