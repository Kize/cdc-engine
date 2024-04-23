import { Rule, Rules } from './rules/rule';
import { RuleEffects } from './rules/rule-effect';
import { GameContextWrapper } from './game-context-event';
import { UnknownGameContext } from './game-context.ts';

export class RuleRunner {
  constructor(private readonly rules: Array<Rule>) {}

  async handleGameEvent(
    event: UnknownGameContext,
    options: Options = {},
  ): Promise<RuleEffects> {
    return this.getFirstApplicableRule(event, options).applyRule(
      new GameContextWrapper(event),
    );
  }

  getFirstApplicableRule(event: UnknownGameContext, options: Options): Rule {
    const rule = this.rules
      .filter((rule) => {
        if (options.rulesWhiteList) {
          return options.rulesWhiteList.includes(rule.name);
        }

        if (options.rulesBlackList) {
          return !options.rulesBlackList.includes(rule.name);
        }

        return true;
      })
      .find((rule) => {
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

type Options =
  | {
      rulesWhiteList?: Array<Rules>;
      rulesBlackList?: never;
    }
  | {
      rulesWhiteList?: never;
      rulesBlackList?: Array<Rules>;
    };
