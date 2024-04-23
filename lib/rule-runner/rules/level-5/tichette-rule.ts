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
import { GameContextEvent } from '../../game-context-event.ts';

export interface TichetteResolution {
  playersWhoClaimedTichette: Array<{ player: Player; score: number }>;
  hasClaimedRobobrol?: boolean;
}

export interface TichetteResolutionPayload {
  player: Player;
  canClaimRobobrol: boolean;
}

export interface RobobrolResolution {
  diceRoll: DiceRoll;
}

export interface RobobrolResolutionPayload {
  player: Player;
}

export class TichetteRule extends DiceRule {
  name = Rules.TICHETTE;

  constructor(
    private readonly tichetteResolver: Resolver<
      TichetteResolution,
      TichetteResolutionPayload
    >,
    private readonly robobrolResolver: Resolver<
      RobobrolResolution,
      RobobrolResolutionPayload
    >,
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const validSums = [3, 5, 7, 11, 13, 17];
    const sum = this.computeSum(diceRoll);

    return validSums.includes(sum);
  }

  async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
    const applicableRuleOnDiceRoll = context.runner.getFirstApplicableRule(
      context,
      true,
    );
    const isCulDeChouette =
      applicableRuleOnDiceRoll instanceof CulDeChouetteRule;

    const { playersWhoClaimedTichette, hasClaimedRobobrol } =
      await this.tichetteResolver.getResolution({
        player: context.player,
        canClaimRobobrol: isCulDeChouette,
      });

    const diceRollRuleEffects =
      await context.runner.handleGameEventInsideTichette(context);

    const shouldStartRobobrolReRoll =
      playersWhoClaimedTichette.length === 1 &&
      isCulDeChouette &&
      hasClaimedRobobrol;

    const robobrolRuleEffects: RuleEffects = [];
    if (shouldStartRobobrolReRoll) {
      const robobrolPlayer = playersWhoClaimedTichette.at(0)!.player;

      const robobrolResolution = await this.robobrolResolver.getResolution({
        player: robobrolPlayer,
      });

      const effects = await context.runner.handleGameEvent({
        event: GameContextEvent.DICE_ROLL,
        player: robobrolPlayer,
        diceRoll: robobrolResolution.diceRoll,
        runner: context.runner,
      });

      robobrolRuleEffects.push(...effects);
    }

    const tichetteRuleEffects = this.computeTichetteRuleEffects(
      playersWhoClaimedTichette,
      context.diceRoll,
      applicableRuleOnDiceRoll,
    );

    return [
      ...diceRollRuleEffects,
      ...tichetteRuleEffects,
      ...robobrolRuleEffects,
    ];
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

    const bestScore = Math.max(
      ...playersWhoClaimedTichette.map((d) => d.score),
    );

    return playersWhoClaimedTichette
      .filter((d) => d.score === bestScore)
      .map((d) => ({
        player: d.player,
        value: tichetteCoef * tichetteScore,
        event:
          tichetteCoef === 1
            ? RuleEffectEvent.TICHETTE_WON
            : RuleEffectEvent.TICHETTE_LOST,
      }));
  }

  private computeSum(diceRoll: DiceRoll): number {
    return diceRoll.reduce((acc, v) => acc + v, 0);
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
