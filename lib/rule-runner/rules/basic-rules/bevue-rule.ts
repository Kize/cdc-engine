import { Rule, Rules } from '../rule';
import {
  GameContextEvent,
  GameContextWrapper,
  UnknownGameContext,
} from '../../game-context-event';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';

export class BevueRule implements Rule {
  name = Rules.BEVUE;

  isApplicableToGameContext(context: UnknownGameContext): boolean {
    return context.event === GameContextEvent.APPLY_BEVUE;
  }

  applyRule(context: GameContextWrapper): RuleEffects {
    return [
      {
        event: RuleEffectEvent.BEVUE,
        player: context.asApplyBevue().playerWhoMadeABevue,
        value: -5,
      },
    ];
  }
}
