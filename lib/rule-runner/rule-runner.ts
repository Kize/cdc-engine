import { Rule, Rules } from './rules/rule';
import { RuleEffects } from './rules/rule-effect';
import { GameContextWrapper } from './game-context-event';
import { UnknownGameContext } from './game-context.ts';

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async handleGameEvent(event: UnknownGameContext): Promise<RuleEffects> {
    return this.getFirstApplicableRule(event).applyRule(
      new GameContextWrapper(event),
    );
  }

  async handleGameEventInsideTichette(
    event: UnknownGameContext,
  ): Promise<RuleEffects> {
    return this.getFirstApplicableRule(event, true).applyRule(
      new GameContextWrapper(event),
    );
  }

  getFirstApplicableRule(
    event: UnknownGameContext,
    isInsideTichette = false,
  ): Rule {
    const rule = this.rules.find((rule) => {
      if (isInsideTichette && rule.name === Rules.TICHETTE) {
        return false;
      }
      return rule.isApplicableToGameContext(event);
    });

    if (!rule) {
      throw new Error('There should always be at least one applicable rule.');
    }

    return rule;
  }

  isRuleEnabled(ruleName: Rules): boolean {
    const rule = this.rules.find((rule) => rule.name === ruleName);

    return !!rule;
  }
}
