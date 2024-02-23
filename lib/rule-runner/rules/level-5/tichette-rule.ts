import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { Resolver } from '../rule-resolver';
import { Rule, Rules } from '../rule';
import { DiceRollGameContext } from '../../game-context.ts';
import { Player } from '../../../player.ts';
import { ChouetteRule } from '../basic-rules/chouette-rule.ts';
import {
  CulDeChouetteRule,
  getCulDeChouetteScore,
} from '../basic-rules/cul-de-chouette-rule.ts';

export interface TichetteResolution {
  playersWhoClaimedTichette: Array<{ player: Player; score: number }>;
}

export interface TichetteResolutionPayload {
  player: Player;
}

export class TichetteRule extends DiceRule {
  name = Rules.TICHETTE;

  constructor(
    private readonly resolver: Resolver<
      TichetteResolution,
      TichetteResolutionPayload
    >,
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const validSums = [3, 5, 7, 11, 13, 17];
    const sum = this.computeSum(diceRoll);

    return validSums.includes(sum);
  }

  private computeSum(diceRoll: DiceRoll): number {
    return diceRoll.reduce((acc, v) => acc + v, 0);
  }

  async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
    const { playersWhoClaimedTichette } = await this.resolver.getResolution({
      player: context.player,
    });

    const diceRollRuleEffects =
      await context.runner.handleGameEventInsideTichette(context);

    const rule = context.runner.getFirstApplicableRule(context, true);

    const tichetteRuleEffects = this.computeTichetteRuleEffects(
      playersWhoClaimedTichette,
      context.diceRoll,
      rule,
    );

    return [...diceRollRuleEffects, ...tichetteRuleEffects];
  }

  private computeTichetteRuleEffects(
    playersWhoClaimedTichette: Array<{
      player: Player;
      score: number;
    }>,
    diceRoll: DiceRoll,
    ruleToApply: Rule,
  ): RuleEffects {
    const playersNumber = playersWhoClaimedTichette.length;

    const tichetteCoef = playersNumber === 1 ? playersNumber : -playersNumber;
    const tichetteScore =
      this.computeSum(diceRoll) +
      this.computeDiceRollValue(diceRoll, ruleToApply);

    const value = tichetteCoef * tichetteScore;

    const bestScore = Math.max(
      ...playersWhoClaimedTichette.map((d) => d.score),
    );

    return playersWhoClaimedTichette
      .filter((d) => d.score === bestScore)
      .map((d) => ({
        player: d.player,
        value,
        event:
          tichetteCoef === 1
            ? RuleEffectEvent.TICHETTE_WON
            : RuleEffectEvent.TICHETTE_LOST,
      }));
  }

  private computeDiceRollValue(diceRoll: DiceRoll, ruleToApply: Rule): number {
    if (ruleToApply instanceof CulDeChouetteRule) {
      return getCulDeChouetteScore(diceRoll);
    }

    if (ruleToApply instanceof ChouetteRule) {
      return ruleToApply.getChouetteScore(diceRoll);
    }

    return 0;
  }
}
