import { describe, expect, it, vi } from 'vitest';
import {
  SiropResolutionPayload,
  SirotageResolution,
  SirotageRule,
} from './sirotage-rule';
import { ChouetteRule } from '../basic-rules/chouette-rule';
import { Resolver, RuleResolver } from '../rule-resolver';
import { RuleEffect, RuleEffectEvent } from '../rule-effect';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder';
import {
  CivetResolution,
  CivetResolutionPayload,
  CivetRule,
} from './civet-rule';
import { RuleRunner } from '../../rule-runner';
import { BidType, SiropBid } from './sirotage-rule.types';

export function testSirotageRule(
  getSirotageRuleForResolution: (
    resolution: SirotageResolution,
  ) => SirotageRule,
): void {
  describe('applyRule', () => {
    it('applies the chouette rule when there is no sirotage', async () => {
      const sirotageRule = getSirotageRuleForResolution({ isSirote: false });

      const chouetteRule = new ChouetteRule();

      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([2, 3, 2])
        .build();

      expect(await sirotageRule.applyRule(gameContext)).toEqual(
        await chouetteRule.applyRule(gameContext),
      );
    });

    it('registers a negative change of score for the player when the sirotage is failed', async () => {
      const sirotageRule = getSirotageRuleForResolution({
        isSirote: true,
        lastDieValue: 4,
        bids: [],
      });
      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([2, 3, 2])
        .build();

      expect(
        await sirotageRule.applyRule(gameContext),
      ).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_LOST,
        player: 'Alban',
        value: -4,
      });
    });

    it('registers a positive change of score for the player when the sirotage is won', async () => {
      const sirotageRule = getSirotageRuleForResolution({
        isSirote: true,
        lastDieValue: 2,
        bids: [],
      });

      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([2, 3, 2])
        .build();

      expect(
        await sirotageRule.applyRule(gameContext),
      ).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_WON,
        player: 'Alban',
        value: 60,
      });
    });

    it("registers a change of score for each player's bet", async () => {
      const bids: Array<SiropBid> = [
        {
          player: 'Alban',
          playerBid: BidType.MOUETTE,
          isBidValidated: false,
        },
        {
          player: 'DelphinWinner',
          playerBid: BidType.CHOUETTE,
          isBidValidated: true,
        },
        {
          player: 'NathanTooSlowToWin',
          playerBid: BidType.CHOUETTE,
          isBidValidated: false,
        },
        {
          player: 'JulesNotBetting',
          playerBid: BidType.COUCHE_SIROP,
          isBidValidated: false,
        },
      ];

      const sirotageRule = getSirotageRuleForResolution({
        isSirote: true,
        lastDieValue: 6,
        bids,
      });

      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([2, 3, 2])
        .build();

      const ruleEffects = await sirotageRule.applyRule(gameContext);
      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_LOST,
        player: 'Alban',
        value: -5,
      });

      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_WON,
        player: 'DelphinWinner',
        value: 25,
      });

      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED,
        player: 'NathanTooSlowToWin',
        value: 0,
      });

      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_SKIPPED,
        player: 'JulesNotBetting',
        value: 0,
      });
    });

    it("registers a change of score for each player's bet on a beau sirop", async () => {
      const bids: Array<SiropBid> = [
        {
          player: 'Alban',
          playerBid: BidType.BEAU_SIROP,
          isBidValidated: true,
        },
        {
          player: 'DelphinTooSlow',
          playerBid: BidType.BEAU_SIROP,
          isBidValidated: false,
        },
      ];

      const sirotageRule = getSirotageRuleForResolution({
        isSirote: true,
        lastDieValue: 3,
        bids,
      });

      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([3, 3, 5])
        .build();

      const ruleEffects = await sirotageRule.applyRule(gameContext);
      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_WON,
        player: 'Alban',
        value: 25,
      });

      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED,
        player: 'DelphinTooSlow',
        value: 0,
      });
    });

    it('adds a civet to the player when a sirop of 6 is lost', async () => {
      const sirotageRule = getSirotageRuleForResolution({
        isSirote: true,
        lastDieValue: 3,
        bids: [],
      });

      const gameContext = DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([6, 6, 5])
        .withRuleRunner(
          new RuleRunner([
            new CivetRule(
              {} as Resolver<CivetResolution, CivetResolutionPayload>,
            ),
          ]),
        )
        .build();

      const ruleEffects = await sirotageRule.applyRule(gameContext);
      expect(ruleEffects).toContainEqual<RuleEffect>({
        event: RuleEffectEvent.ADD_CIVET,
        player: 'Alban',
        value: 0,
      });
    });
  });
}

testSirotageRule((resolution) => {
  const resolver = <RuleResolver<SirotageResolution, SiropResolutionPayload>>{};
  resolver.getResolution = vi.fn().mockResolvedValue(resolution);
  return new SirotageRule(resolver);
});

describe('resolver params', () => {
  it('gives the playable bids to the resolver', async () => {
    const resolver = {
      getResolution: vi.fn().mockResolvedValue({}),
    };
    const sirotageRule = new SirotageRule(resolver);

    const gameContext = DummyContextBuilder.aDiceRollContext()
      .withplayer('Alban')
      .withDiceRoll([3, 3, 5])
      .build();

    await sirotageRule.applyRule(gameContext);
    expect(resolver.getResolution).toHaveBeenCalledWith<
      [SiropResolutionPayload]
    >({
      player: 'Alban',
      playableBids: [
        { type: BidType.BEAU_SIROP, isPlayable: true },
        { type: BidType.COUCHE_SIROP, isPlayable: true },
        { type: BidType.LINOTTE, isPlayable: true },
        { type: BidType.ALOUETTE, isPlayable: true },
        { type: BidType.FAUVETTE, isPlayable: false },
        { type: BidType.MOUETTE, isPlayable: true },
        { type: BidType.BERGERONNETTE, isPlayable: true },
        { type: BidType.CHOUETTE, isPlayable: true },
      ],
      chouetteValue: 3,
    });
  });
});
