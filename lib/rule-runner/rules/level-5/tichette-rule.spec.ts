import { describe, expect, it, vi } from 'vitest';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder';
import {
  RobobrolResolution,
  TichetteResolution,
  TichetteRule,
} from './tichette-rule.ts';
import { RuleRunner } from '../../rule-runner.ts';
import { ChouetteRule } from '../basic-rules/chouette-rule.ts';
import { RuleEffect, RuleEffectEvent } from '../rule-effect.ts';
import { NeantRule } from '../basic-rules/neant-rule.ts';
import {
  SouffletteResolution,
  SouffletteRule,
} from '../level-1/soufflette-rule.ts';
import { VeluteRule } from '../basic-rules/velute-rule.ts';
import {
  CulDeChouetteResolution,
  CulDeChouetteRule,
} from '../basic-rules/cul-de-chouette-rule.ts';

describe('isApplicableToGameContext', () => {
  it('returns true if dice make a 2, 4, 5 combination', () => {
    const rule = new TichetteRule(
      { getResolution: vi.fn() },
      { getResolution: vi.fn() },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([2, 4, 5])
      .build()
      .asDiceRoll();

    expect(rule.isApplicableToGameContext(context)).toBe(true);
  });

  it('returns false if dice make a 1, 1, 2 combination', () => {
    const rule = new TichetteRule(
      { getResolution: vi.fn() },
      { getResolution: vi.fn() },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 1, 2])
      .build()
      .asDiceRoll();

    expect(rule.isApplicableToGameContext(context)).toBe(false);
  });
});

describe('applyRule', () => {
  it('applies the initial chouette', async () => {
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue({
          playersWhoClaimedTichette: [{ player: 'Alban', score: 1 }],
        } as TichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue({}) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 1, 3])
      .withplayer('Alban')
      .withRuleRunner(new RuleRunner([new ChouetteRule()]))
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CHOUETTE,
      player: 'Alban',
      value: expect.anything() as number,
    });
  });

  it('returns a rule effect where one player won the tichette they claimed', async () => {
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue({
          playersWhoClaimedTichette: [{ player: 'Alban', score: 1 }],
        } as TichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue({}) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 1, 3])
      .withplayer('Alban')
      .withRuleRunner(new RuleRunner([new ChouetteRule()]))
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_WON,
      player: 'Alban',
      value: 6,
    });
  });

  it('returns a rule effect where the player with the best score loses the tichette', async () => {
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue({
          playersWhoClaimedTichette: [
            { player: 'Alban', score: 1 },
            { player: 'Delphin', score: 100 },
            { player: 'Anais', score: 50 },
          ],
        } as TichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue({}) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 2, 1])
      .withplayer('Alban')
      .withRuleRunner(new RuleRunner([new NeantRule()]))
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_LOST,
      player: 'Delphin',
      value: -21,
    });
  });

  it('returns rule effects where all first players lose the tichette', async () => {
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue({
          playersWhoClaimedTichette: [
            { player: 'Alban', score: 100 },
            { player: 'Lou', score: 100 },
            { player: 'Delphin', score: 100 },
            { player: 'Anais', score: 50 },
          ],
        } as TichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue({}) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([6, 6, 5])
      .withplayer('Alban')
      .withRuleRunner(new RuleRunner([new ChouetteRule()]))
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_LOST,
      player: 'Alban',
      value: -212,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_LOST,
      player: 'Lou',
      value: -212,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_LOST,
      player: 'Delphin',
      value: -212,
    });
  });

  it('returns a won tichette of 7 for a won soufflette challenge', async () => {
    const tichetteResolution = {
      playersWhoClaimedTichette: [{ player: 'Alban', score: 100 }],
    } as TichetteResolution;

    const souffletteResolution = {
      isChallenge: true,
      numberOfDiceRolls: 3,
      diceRoll: [3, 3, 3],
      challengedPlayer: 'Lou',
    } as SouffletteResolution;

    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue(tichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue({}) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([4, 2, 1])
      .withplayer('Alban')
      .withRuleRunner(
        new RuleRunner([
          new SouffletteRule({
            getResolution: vi.fn().mockResolvedValue(souffletteResolution),
          }),
          new ChouetteRule(),
        ]),
      )
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_WON,
      player: 'Alban',
      value: 7,
    });
  });

  it('triggers a second turn in case of a robobrol, and it resolves the second turn for the person calling the robobrol', async () => {
    const tichetteResolution: TichetteResolution = {
      playersWhoClaimedTichette: [{ player: 'Jules', score: 100 }],
      hasClaimedRobobrol: true,
    };
    const culDeChouetteResolution: CulDeChouetteResolution = {
      claimingPlayer: 'Alban',
    };

    const robobrolResolution: RobobrolResolution = {
      diceRoll: [1, 4, 5],
    };
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue(tichetteResolution),
      },
      { getResolution: vi.fn().mockResolvedValue(robobrolResolution) },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 1, 1])
      .withplayer('Alban')
      .withRuleRunner(
        new RuleRunner([
          new VeluteRule(),
          new CulDeChouetteRule({
            getResolution: vi.fn().mockResolvedValue(culDeChouetteResolution),
          }),
          new NeantRule(),
        ]),
      )
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_WON,
      player: 'Jules',
      value: 53,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.VELUTE,
      player: 'Jules',
      value: 50,
    });
  });

  it('does not trigger a second turn in case of a robobrol, when 2 players claimed the robobrol', async () => {
    const tichetteResolution: TichetteResolution = {
      playersWhoClaimedTichette: [
        { player: 'Jules', score: 100 },
        { player: 'Lou', score: 10 },
      ],
    };
    const culDeChouetteResolution: CulDeChouetteResolution = {
      claimingPlayer: 'Alban',
    };

    const getRobobrolResolution = vi.fn();
    const rule = new TichetteRule(
      {
        getResolution: vi.fn().mockResolvedValue(tichetteResolution),
      },
      { getResolution: getRobobrolResolution },
    );

    const context = DummyContextBuilder.aDiceRollContext()
      .withDiceRoll([1, 1, 1])
      .withplayer('Alban')
      .withRuleRunner(
        new RuleRunner([
          new VeluteRule(),
          new CulDeChouetteRule({
            getResolution: vi.fn().mockResolvedValue(culDeChouetteResolution),
          }),
          new NeantRule(),
        ]),
      )
      .build();

    const ruleEffects = await rule.applyRule(context);

    expect(getRobobrolResolution).not.toHaveBeenCalled();

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.TICHETTE_LOST,
      player: 'Jules',
      value: -106,
    });
  });
});
