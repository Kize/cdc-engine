import { Rule, Rules } from './rules/rule';
import { RuleEffects } from './rules/rule-effect';
import { GameContextWrapper } from './game-context-event';
import { UnknownGameContext } from './game-context.ts';
import { Resolvers, RulesConfiguration } from './rule-runner-configuration.ts';
import { getAllRulesEnabled, instanciateRules } from './rule-runner.utils.ts';

export class RuleRunner {
  private readonly rules: Array<Rule>;
  constructor(rulesConfiguration?: RulesConfiguration, resolvers?: Resolvers) {
    if (!rulesConfiguration || !resolvers) {
      this.rules = [];
      return;
    }

    const enabledRules = getAllRulesEnabled(rulesConfiguration);
    this.rules = instanciateRules(enabledRules, resolvers);
  }

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
