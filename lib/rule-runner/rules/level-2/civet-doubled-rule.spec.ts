import { describe, expect, it, vi } from 'vitest';
import { RuleResolver } from '../rule-resolver.ts';
import {
  CivetDoubledResolution,
  CivetDoubledRule,
} from './civet-doubled-rule.ts';
import { CivetBet, CivetResolutionPayload } from '../level-1/civet-rule.ts';
import { testCivetRule } from '../level-1/civet-rule.spec.ts';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder.ts';
import { RuleEffect, RuleEffectEvent } from '../rule-effect.ts';
import { RuleRunner } from '../../rule-runner.ts';
import { VeluteRule } from '../basic-rules/velute-rule.ts';

describe('It has the civet behaviour', () => {
  describe('when there are no other betting players', () => {
    testCivetRule((resolution) => {
      const resolver = <
        RuleResolver<CivetDoubledResolution, CivetResolutionPayload>
      >{};

      resolver.getResolution = vi.fn().mockResolvedValue({
        ...resolution,
        otherBettingPlayers: [],
      });

      return new CivetDoubledRule(resolver);
    });
  });

  describe('when there is 1 other betting player', () => {
    testCivetRule((resolution) => {
      const resolver = <
        RuleResolver<CivetDoubledResolution, CivetResolutionPayload>
      >{};

      resolver.getResolution = vi.fn().mockResolvedValue({
        ...resolution,
        otherBettingPlayers: [],
      });

      return new CivetDoubledRule(resolver);
    });
  });
});

describe('applyRule', () => {
  it('removes the civet status for other betting players', async () => {
    const resolver = {
      getResolution: vi.fn().mockResolvedValue({
        isVerdier: false,
        betAmount: 1,
        playerBet: CivetBet.VELUTE,
        diceRoll: [3, 3, 3],
        otherBettingPlayers: ['Delphin', 'Jules'],
      } as CivetDoubledResolution),
    };

    const rule = new CivetDoubledRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext().withplayer('Alban').build(),
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.REMOVE_CIVET,
      player: 'Delphin',
      value: 0,
    });

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.REMOVE_CIVET,
      player: 'Jules',
      value: 0,
    });
  });

  it('doubles the score of the civet when one other player bets', async () => {
    const resolver = {
      getResolution: vi.fn().mockResolvedValue({
        isVerdier: false,
        betAmount: 102,
        playerBet: CivetBet.VELUTE,
        diceRoll: [2, 4, 6],
        otherBettingPlayers: ['Delphin'],
      } as CivetDoubledResolution),
    };

    const rule = new CivetDoubledRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext()
        .withRuleRunner(new RuleRunner([new VeluteRule()]))
        .withplayer('Alban')
        .build(),
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CIVET_WON,
      player: 'Alban',
      value: 204,
    });
  });

  it('quadruples the score of the civet when two other players bet', async () => {
    const resolver = {
      getResolution: vi.fn().mockResolvedValue({
        isVerdier: false,
        betAmount: 102,
        playerBet: CivetBet.VELUTE,
        diceRoll: [2, 4, 4],
        otherBettingPlayers: ['Delphin', 'Jules'],
      } as CivetDoubledResolution),
    };

    const rule = new CivetDoubledRule(resolver);

    const ruleEffects = await rule.applyRule(
      DummyContextBuilder.aCivetContext().withplayer('Alban').build(),
    );

    expect(ruleEffects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.CIVET_LOST,
      player: 'Alban',
      value: -408,
    });
  });
});
