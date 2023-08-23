import { Player } from '../player';
import { GameEvent, HistoryHelper } from '../history/history-helper.ts';
import { RuleRunner } from '../rule-runner/rule-runner';
import { Rules } from '../rule-runner/rules/rule';
import { GameLineType, getNewEventId } from '../history/history-line.ts';
import {
  ChallengeGrelottineGameContext,
  PlayATurnGameContext,
  UnknownGameContext,
} from '../rule-runner/game-context.ts';
import { nanoid } from '@reduxjs/toolkit';
import { GameContextEvent } from '../rule-runner/game-context-event.ts';
import {
  Resolvers,
  RulesConfiguration,
} from '../rule-runner/rule-runner-configuration.ts';

export enum GameStatus {
  CREATION = 'creation',
  IN_GAME = 'in game',
  FINISHED = 'finished',
}

export class GameHandler {
  history: HistoryHelper;
  ruleRunner: RuleRunner;

  constructor() {
    this.history = new HistoryHelper();
    this.ruleRunner = new RuleRunner();
  }

  getGameStatus(events: Array<GameEvent>, players: Array<Player>): GameStatus {
    if (players.length === 0 || !this.ruleRunner.isRuleEnabled(Rules.NEANT)) {
      return GameStatus.CREATION;
    }

    const playerScores = players.map((player) =>
      this.history.getPlayerScore(events, player),
    );

    const maxScore = Math.max(...playerScores);
    if (maxScore >= 343) {
      return GameStatus.FINISHED;
    }

    return GameStatus.IN_GAME;
  }

  getNumberOfTurns(events: Array<GameEvent>, players: Array<Player>): number {
    if (players.length === 0) {
      return 0;
    }

    const turnNumbersPerPlayer = players.map((player) =>
      this.history.getNumberOfTurnsPlayed(events, player),
    );

    if (turnNumbersPerPlayer[0] === 0) {
      return 1;
    }

    if (
      turnNumbersPerPlayer[0] ===
      turnNumbersPerPlayer[turnNumbersPerPlayer.length - 1]
    ) {
      return turnNumbersPerPlayer[0] + 1;
    }

    return turnNumbersPerPlayer[0];
  }

  getCurrentPlayer(events: Array<GameEvent>, players: Array<Player>): Player {
    if (players.length === 0) {
      throw new Error('no players defined.');
    }

    const playersWithTurnsNumbers = players.map((player) => ({
      player,
      numberOfTurnsPlayed: this.history.getNumberOfTurnsPlayed(events, player),
    }));

    const currentPlayer = playersWithTurnsNumbers.find(
      (playerWrapper, index, array) => {
        if (index === 0) {
          return false;
        }

        return (
          playerWrapper.numberOfTurnsPlayed <
          array[index - 1].numberOfTurnsPlayed
        );
      },
    )?.player;

    return currentPlayer ?? players[0];
  }

  setRules(rulesConfiguration: RulesConfiguration, resolvers: Resolvers): void {
    this.ruleRunner = new RuleRunner(rulesConfiguration, resolvers);
  }

  async playATurn(context: PlayATurnGameContext): Promise<GameEvent> {
    const turnPlayed: GameEvent['historyLines'][0] = {
      player: context.player,
      amount: 0,
      designation: GameLineType.PLAY_TURN,
    };

    const gameEvent = await this.applyRuleEngine(context);

    return {
      ...gameEvent,
      historyLines: [turnPlayed, ...gameEvent.historyLines],
    };
  }

  async applyBevue(player: Player): Promise<GameEvent> {
    return this.applyRuleEngine({
      event: GameContextEvent.APPLY_BEVUE,
      playerWhoMadeABevue: player,
    });
  }

  async startGrelottineChallenge(
    context: ChallengeGrelottineGameContext,
  ): Promise<GameEvent> {
    return this.applyRuleEngine(context);
  }

  singSloubi(): Promise<GameEvent> {
    throw new Error('not implemented yet :(');
  }

  addOperations(): Promise<GameEvent> {
    throw new Error('not implemented yet :(');
  }

  private async applyRuleEngine(
    context: UnknownGameContext,
  ): Promise<GameEvent> {
    const ruleEffects = await this.ruleRunner.handleGameEvent(context);

    return {
      id: getNewEventId(),
      historyLines: ruleEffects.map((ruleEffect) => ({
        designation: ruleEffect.event,
        player: ruleEffect.player,
        amount: ruleEffect.value,
      })),
    };
  }
}

export function getNewGameId(): string {
  return nanoid(16);
}
