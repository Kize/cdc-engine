import {
  ActiveSirotageResolution,
  SiropResolutionPayload,
  SirotageRule,
} from './sirotage-rule';
import { Resolver } from '../rule-resolver';
import { DiceRoll, DieValue } from '../dice-rule';
import { RuleEffect, RuleEffectEvent, RuleEffects } from '../rule-effect';
import { Rules } from '../rule';
import { BidType, SiropBid } from './sirotage-rule.types';
import { DiceRollGameContext } from '../../game-context.ts';

export type AttrapeOiseauResolution =
  | { isSirote: false }
  | ActiveAttrapeOiseauResolution;

export interface ActiveAttrapeOiseauResolution
  extends ActiveSirotageResolution {
  playerWhoMakeAttrapeOiseau: string | undefined;
}

const ATTRAPE_OISEAU_BID_TYPES = [
  BidType.BEAU_SIROP,
  BidType.COUCHE_SIROP,
  BidType.FILE_SIROP,
  BidType.LINOTTE,
  BidType.ALOUETTE,
  BidType.FAUVETTE,
  BidType.MOUETTE,
  BidType.BERGERONNETTE,
  BidType.CHOUETTE,
];

export class AttrapeOiseauRule extends SirotageRule {
  name = Rules.ATTRAPE_OISEAU;

  constructor(
    private attrapeOiseauResolver: Resolver<
      AttrapeOiseauResolution,
      SiropResolutionPayload
    >,
  ) {
    super(attrapeOiseauResolver);
  }

  protected mapPlayerBidToRuleEffect(
    playerBid: SiropBid,
    diceRoll: DiceRoll,
    lastDieValue: DieValue,
  ): RuleEffect {
    if (playerBid.playerBid === BidType.FILE_SIROP) {
      return {
        event: RuleEffectEvent.SIROP_BET_WON,
        player: playerBid.player,
        value: 0,
      };
    }

    return super.mapPlayerBidToRuleEffect(playerBid, diceRoll, lastDieValue);
  }

  async applyDiceRule({
    player,
    diceRoll,
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    let initialChouetteRuleEffect: RuleEffect | undefined;
    const chouetteValue = this.getChouetteValue(diceRoll);

    const resolution = await this.attrapeOiseauResolver.getResolution({
      player,
      chouetteValue,
      playableBids: this.getPlayableBids(
        chouetteValue,
        ATTRAPE_OISEAU_BID_TYPES,
      ),
    });

    if (!resolution.isSirote) {
      return [this.getChouetteRuleEffect(player, diceRoll)];
    }

    let attrapeOiseauRuleEffects: Array<RuleEffect>;
    if (resolution.playerWhoMakeAttrapeOiseau) {
      const sirotageRuleEffects = await this.getSirotageRuleEffects(
        resolution.playerWhoMakeAttrapeOiseau,
        diceRoll,
        resolution,
        runner,
      );

      attrapeOiseauRuleEffects = sirotageRuleEffects.map((ruleEffect) => {
        let event: RuleEffectEvent;

        switch (ruleEffect.event) {
          case RuleEffectEvent.SIROP_WON:
            event = RuleEffectEvent.ATTRAPE_OISEAU_WON;
            break;
          case RuleEffectEvent.SIROP_LOST:
            event = RuleEffectEvent.ATTRAPE_OISEAU_LOST;
            break;
          case RuleEffectEvent.SIROP_STOLEN:
            event = RuleEffectEvent.ATTRAPE_OISEAU_STOLEN;
            break;

          default:
            event = ruleEffect.event;
        }

        return { ...ruleEffect, event };
      });

      initialChouetteRuleEffect = this.getChouetteRuleEffect(player, diceRoll);
    } else {
      attrapeOiseauRuleEffects = await this.getSirotageRuleEffects(
        player,
        diceRoll,
        resolution,
        runner,
      );
    }

    return [
      ...(initialChouetteRuleEffect ? [initialChouetteRuleEffect] : []),
      ...attrapeOiseauRuleEffects,
      ...this.getBidRuleEffects(resolution, diceRoll),
    ];
  }
}
