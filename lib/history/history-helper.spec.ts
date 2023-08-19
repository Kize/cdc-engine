import { describe, expect, it } from 'vitest';
import { HistoryHelper } from './history-helper.ts';
import { RuleEffectEvent } from '../rule-runner/rules/rule-effect';
import { GameLineType, GodModLineType } from './history-line';

describe('getPlayerScore', () => {
  it('returns 0 when the player is not in the history yet', () => {
    const history = new HistoryHelper();

    const events = [
      {
        id: '1',
        historyLines: [
          {
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
            player: 'Delphin',
            amount: 100,
          },
        ],
      },
    ];

    expect(history.getPlayerScore(events, 'Alban')).toBe(0);
  });

  it('returns 50 when the player has 3 scores updates, of 25, -5, 30', () => {
    const history = new HistoryHelper();

    const events = [
      {
        id: '1',
        historyLines: [
          {
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
            player: 'Delphin',
            amount: 100,
          },
        ],
      },
      {
        id: '2',
        historyLines: [
          {
            designation: GodModLineType.GOD_MOD,
            player: 'Alban',
            amount: 25,
          },
        ],
      },
      {
        id: '3',
        historyLines: [
          {
            designation: RuleEffectEvent.BEVUE,
            player: 'Alban',
            amount: -5,
          },
          {
            designation: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
            player: 'Alban',
            amount: 30,
          },
          {
            designation: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
            player: 'Delphin',
            amount: -30,
          },
        ],
      },
    ];

    expect(history.getPlayerScore(events, 'Alban')).toBe(50);
  });
});

describe('getPlayerScoreAtEvent', () => {
  it('returns 25 when called for the event 2', () => {
    const history = new HistoryHelper();

    const events = [
      {
        id: '1',
        historyLines: [
          {
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
            player: 'Delphin',
            amount: 100,
          },
        ],
      },
      {
        id: '2',
        historyLines: [
          {
            designation: GodModLineType.GOD_MOD,
            player: 'Alban',
            amount: 25,
          },
        ],
      },
      {
        id: '3',
        historyLines: [
          {
            designation: RuleEffectEvent.BEVUE,
            player: 'Alban',
            amount: -5,
          },
        ],
      },
    ];
    expect(history.getPlayerScoreAtEvent(events, 'Alban', '2')).toBe(25);
  });
});

describe('getNumberOfTurnsPlayed', () => {
  it('returns 0 when the player has not played yet', () => {
    const history = new HistoryHelper();

    const events = [
      {
        id: '1',
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: 'Jules',
            amount: 0,
          },
        ],
      },
    ];

    expect(history.getNumberOfTurnsPlayed(events, 'Alban')).toBe(0);
  });
  it('returns 2 when the player has played 2 turns', () => {
    const history = new HistoryHelper();

    const events = [
      {
        id: '1',
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: 'Alban',
            amount: 0,
          },
        ],
      },
      {
        id: '1',
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: 'Jules',
            amount: 0,
          },
        ],
      },
      {
        id: '1',
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: 'Alban',
            amount: 0,
          },
        ],
      },
    ];

    expect(history.getNumberOfTurnsPlayed(events, 'Alban')).toBe(2);
  });
});
