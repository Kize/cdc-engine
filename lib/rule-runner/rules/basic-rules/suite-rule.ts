import { Resolver } from '../rule-resolver';
import { getVeluteValue, isVelute } from './velute-rule';
import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { Rules } from '../rule';
import { DiceRollGameContext } from '../../game-context.ts';
import { Player } from '../../../player.ts';

export interface SuiteResolution {
  loosingplayer: string;
  multiplier: number;
}

export interface SuiteResolutionPayload {
  player: Player;
}

export class SuiteRule extends DiceRule {
  name = Rules.SUITE;

  constructor(
    private readonly resolver: Resolver<
      SuiteResolution,
      SuiteResolutionPayload
    >,
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
  }

  async applyDiceRule({
    diceRoll,
    player,
    runner,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const ruleEffects: RuleEffects = [];

    if (isVelute(diceRoll) && runner.isRuleEnabled(Rules.VELUTE)) {
      ruleEffects.push({
        event: RuleEffectEvent.SUITE_VELUTE,
        player: player,
        value: getVeluteValue(diceRoll),
      });
    }

    const suiteResolution = await this.resolver.getResolution({ player });

    ruleEffects.push({
      event: RuleEffectEvent.SUITE,
      player: suiteResolution.loosingplayer,
      value: -10 * suiteResolution.multiplier,
    });

    return ruleEffects;
  }
}
