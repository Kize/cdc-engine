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

  getFirstApplicableRule(event: UnknownGameContext): Rule {
    const rule = this.rules.find((rule) =>
      rule.isApplicableToGameContext(event),
    );

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

export interface RulesConfiguration {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
  isCivetEnabled: boolean;
  isArtichetteEnabled: boolean;
  isVerdierEnabled: boolean;
  isBleuRougeEnabled: boolean;
}
