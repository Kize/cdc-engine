import { DiceRule } from '../dice-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { DiceRollGameContext } from '../../game-context-event';
import { Rules } from '../rule';

export class NeantRule extends DiceRule {
  name = Rules.NEANT;

  isApplicableToDiceRoll(): boolean {
    return true;
  }

  applyDiceRule(context: DiceRollGameContext): RuleEffects {
    return [
      {
        event: RuleEffectEvent.NEANT,
        player: context.player,
        value: 0,
      },
      {
        event: RuleEffectEvent.ADD_GRELOTTINE,
        player: context.player,
        value: 0,
      },
    ];
  }
}
