import { DiceRoll, DiceRule, DieValue } from '../dice-rule';
import { RuleEffect, RuleEffectEvent, RuleEffects } from '../rule-effect';
import { DiceRollGameContext } from '../../game-context-event';
import { Rules } from '../rule';

export class ChouetteRule extends DiceRule {
  name = Rules.CHOUETTE;

  isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
    return (
      dieValue1 === dieValue2 ||
      dieValue1 === dieValue3 ||
      dieValue2 === dieValue3
    );
  }

  protected getChouetteRuleEffect(
    player: string,
    diceRoll: DiceRoll,
  ): RuleEffect {
    const score = this.getChouetteScore(diceRoll);
    return {
      event: RuleEffectEvent.CHOUETTE,
      player: player,
      value: score,
    };
  }

  async applyDiceRule({
    player,
    diceRoll,
  }: DiceRollGameContext): Promise<RuleEffects> {
    return [this.getChouetteRuleEffect(player, diceRoll)];
  }

  protected getChouetteScore(diceRoll: DiceRoll): number {
    const chouetteValue = this.getChouetteValue(diceRoll);

    return chouetteValue ** 2;
  }

  protected getChouetteValue([
    dieValue1,
    dieValue2,
    dieValue3,
  ]: DiceRoll): DieValue {
    return dieValue1 === dieValue2 || dieValue1 === dieValue3
      ? dieValue1
      : dieValue2;
  }
}
