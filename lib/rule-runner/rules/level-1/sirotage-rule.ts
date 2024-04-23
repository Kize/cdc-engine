import { ChouetteRule } from '../basic-rules/chouette-rule';
import { Resolver } from '../rule-resolver';
import { DiceRoll, DieValue } from '../dice-rule';
import { RuleEffect, RuleEffectEvent, RuleEffects } from '../rule-effect';
import { RuleRunner } from '../../rule-runner';
import { Rules } from '../rule';
import {
  BidType,
  dieValueToBidType,
  PlayableBid,
  SiropBid,
  SIROTAGE_BID_TYPES,
} from './sirotage-rule.types';
import { DiceRollGameContext } from '../../game-context.ts';
import { GameContextEvent } from '../../game-context-event.ts';

export interface SiropResolutionPayload {
  player: string;
  playableBids: Array<PlayableBid>;
  chouetteValue: DieValue;
}

export type SirotageResolution = { isSirote: false } | ActiveSirotageResolution;

export interface ActiveSirotageResolution {
  isSirote: true;
  lastDieValue: DieValue;
  bids: Array<SiropBid>;
}

export class SirotageRule extends ChouetteRule {
  name = Rules.SIROP;

  constructor(
    private readonly sirotageResolver: Resolver<
      SirotageResolution,
      SiropResolutionPayload
    >,
  ) {
    super();
  }

  protected getPlayableBids(
    chouetteValue: DieValue,
    ruleBidTypes: Array<BidType>,
  ): Array<PlayableBid> {
    const disableBidType = dieValueToBidType.get(chouetteValue);
    return ruleBidTypes.map((bidType) => ({
      type: bidType,
      isPlayable: bidType !== disableBidType,
    }));
  }

  async applyDiceRule({
    player,
    diceRoll,
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const resolution = await this.sirotageResolver.getResolution({
      player,
      chouetteValue,
      playableBids: this.getPlayableBids(chouetteValue, SIROTAGE_BID_TYPES),
    });

    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(player, diceRoll)];
    }

    const sirotageRuleEffects = await this.getSirotageRuleEffects(
      player,
      diceRoll,
      resolution,
      runner,
    );

    const bidRuleEffects = this.getBidRuleEffects(resolution, diceRoll);

    return [...sirotageRuleEffects, ...bidRuleEffects];
  }

  protected mapPlayerBidToRuleEffect(
    playerBid: SiropBid,
    diceRoll: DiceRoll,
    lastDieValue: DieValue,
  ): RuleEffect {
    let value: number;

    const winningBet =
      lastDieValue === this.getChouetteValue(diceRoll)
        ? BidType.BEAU_SIROP
        : dieValueToBidType.get(lastDieValue);

    let event: RuleEffectEvent;
    if (playerBid.playerBid === winningBet) {
      value = playerBid.isBidValidated ? 25 : 0;
      event = playerBid.isBidValidated
        ? RuleEffectEvent.SIROP_BET_WON
        : RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED;
    } else if (playerBid.playerBid === BidType.COUCHE_SIROP) {
      value = 0;
      event = RuleEffectEvent.SIROP_BET_SKIPPED;
    } else {
      value = -5;
      event = RuleEffectEvent.SIROP_BET_LOST;
    }

    return {
      event,
      player: playerBid.player,
      value,
    };
  }

  protected getBidRuleEffects(
    resolution: ActiveSirotageResolution,
    diceRoll: [DieValue, DieValue, DieValue],
  ): RuleEffects {
    return resolution.bids.map((playerBid) =>
      this.mapPlayerBidToRuleEffect(
        playerBid,
        diceRoll,
        resolution.lastDieValue,
      ),
    );
  }

  protected async getSirotageRuleEffects(
    currentplayer: string,
    diceRoll: DiceRoll,
    resolution: ActiveSirotageResolution,
    runner: RuleRunner,
  ): Promise<RuleEffect[]> {
    const chouetteValue = this.getChouetteValue(diceRoll);
    const isSirotageWon = resolution.lastDieValue === chouetteValue;

    if (isSirotageWon) {
      const ruleEffects = await runner.handleGameEvent(
        {
          event: GameContextEvent.DICE_ROLL,
          player: currentplayer,
          diceRoll: [chouetteValue, chouetteValue, chouetteValue],
          runner,
        },
        { rulesWhiteList: [Rules.CUL_DE_CHOUETTE] },
      );

      return ruleEffects.map((ruleEffect) => ({
        ...ruleEffect,
        event:
          ruleEffect.event === RuleEffectEvent.CUL_DE_CHOUETTE
            ? RuleEffectEvent.SIROP_WON
            : RuleEffectEvent.SIROP_STOLEN,
      }));
    }

    const lostSirotageRuleEffects: Array<RuleEffect> = [
      {
        event: RuleEffectEvent.SIROP_LOST,
        player: currentplayer,
        value: -this.getChouetteScore(diceRoll),
      },
    ];

    if (chouetteValue === 6 && runner.isRuleEnabled(Rules.CIVET)) {
      lostSirotageRuleEffects.push({
        event: RuleEffectEvent.ADD_CIVET,
        player: currentplayer,
        value: 0,
      });
    }

    return lostSirotageRuleEffects;
  }
}
