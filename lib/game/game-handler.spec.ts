import { describe, expect, it, vi } from 'vitest';
import { GameHandler } from './game-handler.ts';
import { Player } from '../player';

describe('getCurrentplayer', () => {
  it('throws an exception when there are no players', () => {
    const game = new GameHandler();

    expect(() => {
      game.getCurrentPlayer([], []);
    }).toThrowError('no players defined');
  });

  it('returns the name of the first player when the history is empty', () => {
    const game = new GameHandler();

    const players: Array<Player> = ['Alban', 'Delphin'];

    expect(game.getCurrentPlayer([], players)).toEqual<Player>('Alban');
  });

  it('returns the name of the third player when the first two have played', () => {
    const alban = 'Alban';
    const delphin = 'Delphin';
    const jules = 'Jules';

    const players: Array<Player> = [alban, delphin, jules];

    const game = new GameHandler();

    game.history.getNumberOfTurnsPlayed = vi
      .fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0);

    expect(game.getCurrentPlayer([], players)).toEqual<Player>(jules);
  });
});

describe('getNumberOfTurns', () => {
  it('returns 0 when there are no players', () => {
    const game = new GameHandler();

    expect(game.getNumberOfTurns([], [])).toBe(0);
  });

  it('returns 1 when nobody has played yet', () => {
    const players: Array<Player> = ['Alban', 'Delphin'];
    const game = new GameHandler();

    game.history.getNumberOfTurnsPlayed = vi.fn().mockReturnValue(0);

    expect(game.getNumberOfTurns([], players)).toBe(1);
  });

  it('returns 1 when half of the players have played 1 time', () => {
    const players: Array<Player> = ['Alban', 'Delphin', 'Jules', 'Thibault'];
    const game = new GameHandler();

    game.history.getNumberOfTurnsPlayed = vi
      .fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    expect(game.getNumberOfTurns([], players)).toBe(1);
  });

  it('returns 3 when all players have played 2 times', () => {
    const players: Array<Player> = ['Alban', 'Delphin'];
    const game = new GameHandler();

    game.history.getNumberOfTurnsPlayed = vi
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2);

    expect(game.getNumberOfTurns([], players)).toBe(3);
  });
});
