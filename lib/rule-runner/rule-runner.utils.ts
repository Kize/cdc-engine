import {
	ALL_RULES_ORDERED,
	BASIC_RULES,
	type Resolvers,
	type RulesConfiguration,
} from "./rule-runner-configuration.ts";
import { BevueRule } from "./rules/basic-rules/bevue-rule.ts";
import { ChouetteRule } from "./rules/basic-rules/chouette-rule.ts";
import { ChouetteVeluteRule } from "./rules/basic-rules/chouette-velute-rule.ts";
import { CulDeChouetteRule } from "./rules/basic-rules/cul-de-chouette-rule.ts";
import { DoubleBevueRule } from "./rules/basic-rules/double-bevue-rule.ts";
import { GrelottineRule } from "./rules/basic-rules/grelottine-rule.ts";
import { NeantRule } from "./rules/basic-rules/neant-rule.ts";
import { SuiteRule } from "./rules/basic-rules/suite-rule.ts";
import { VeluteRule } from "./rules/basic-rules/velute-rule.ts";
import { AttrapeOiseauRule } from "./rules/level-1/attrape-oiseau-rule.ts";
import { CivetRule } from "./rules/level-1/civet-rule.ts";
import { SirotageRule } from "./rules/level-1/sirotage-rule.ts";
import { SouffletteRule } from "./rules/level-1/soufflette-rule.ts";
import { ArtichetteRule } from "./rules/level-2/artichette-rule.ts";
import { CivetDoubledRule } from "./rules/level-2/civet-doubled-rule.ts";
import { BleuRougeRule } from "./rules/level-3/bleu-rouge-rule.ts";
import { VerdierRule } from "./rules/level-3/verdier-rule.ts";
import { TichetteRule } from "./rules/level-5/tichette-rule.ts";
import { type Rule, Rules } from "./rules/rule.ts";

export function getAllRulesEnabled(
	rulesConfiguration: RulesConfiguration,
): Array<Rules> {
	const enabledRules = new Set(BASIC_RULES);

	if (rulesConfiguration.isSouffletteEnabled) {
		enabledRules.add(Rules.SOUFFLETTE);
	}

	if (rulesConfiguration.isSiropEnabled) {
		enabledRules.add(Rules.SIROP);
	}

	if (rulesConfiguration.isAttrapeOiseauEnabled) {
		enabledRules.add(Rules.ATTRAPE_OISEAU);
	}

	if (rulesConfiguration.isCivetEnabled) {
		enabledRules.add(Rules.CIVET);
	}

	if (rulesConfiguration.isArtichetteEnabled) {
		enabledRules.add(Rules.ARTICHETTE);
	}

	if (rulesConfiguration.isVerdierEnabled) {
		enabledRules.add(Rules.VERDIER);
	}

	if (rulesConfiguration.isBleuRougeEnabled) {
		enabledRules.add(Rules.BLEU_ROUGE);
	}

	if (rulesConfiguration.isDoubleBevueEnabled) {
		enabledRules.add(Rules.DOUBLE_BEVUE);
	}

	if (rulesConfiguration.isCivetDoubleEnabled) {
		enabledRules.add(Rules.CIVET_DOUBLED);
	}

	if (rulesConfiguration.isTichetteEnabled) {
		enabledRules.add(Rules.TICHETTE);
	}

	return ALL_RULES_ORDERED.filter((rule) => enabledRules.has(rule));
}

export function instanciateRules(
	activeRules: Array<Rules>,
	resolvers: Resolvers,
): Array<Rule> {
	return activeRules.map((ruleName) => {
		switch (ruleName) {
			case Rules.BEVUE:
				return new BevueRule();
			case Rules.DOUBLE_BEVUE:
				return new DoubleBevueRule();
			case Rules.GRELOTTINE:
				return new GrelottineRule(resolvers.grelottineRuleResolver);
			case Rules.NEANT:
				return new NeantRule();
			case Rules.CHOUETTE:
				return new ChouetteRule();
			case Rules.VELUTE:
				return new VeluteRule();
			case Rules.CHOUETTE_VELUTE:
				return new ChouetteVeluteRule(resolvers.chouetteVeluteRuleResolver);
			case Rules.SUITE:
				return new SuiteRule(resolvers.suiteRuleResolver);
			case Rules.CUL_DE_CHOUETTE:
				return new CulDeChouetteRule(resolvers.culDeChouetteRuleResolver);
			case Rules.SOUFFLETTE:
				if (!resolvers.souffletteRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new SouffletteRule(resolvers.souffletteRuleResolver);
			case Rules.SIROP:
				if (!resolvers.siropRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new SirotageRule(resolvers.siropRuleResolver);
			case Rules.ATTRAPE_OISEAU:
				if (!resolvers.attrapeOiseauRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new AttrapeOiseauRule(resolvers.attrapeOiseauRuleResolver);
			case Rules.CIVET:
				if (!resolvers.civetRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new CivetRule(resolvers.civetRuleResolver);
			case Rules.ARTICHETTE:
				if (!resolvers.artichetteRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new ArtichetteRule(resolvers.artichetteRuleResolver);
			case Rules.VERDIER:
				if (!resolvers.verdierRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new VerdierRule(resolvers.verdierRuleResolver);
			case Rules.BLEU_ROUGE:
				if (!resolvers.bleuRougeRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new BleuRougeRule(resolvers.bleuRougeRuleResolver);
			case Rules.CIVET_DOUBLED:
				if (!resolvers.civetDoubleRuleResolver) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new CivetDoubledRule(resolvers.civetDoubleRuleResolver);
			case Rules.TICHETTE:
				if (
					!resolvers.tichetteRuleResolver ||
					!resolvers.robobrolRuleResolver
				) {
					throw new ResolverNotProvidedError(ruleName);
				}
				return new TichetteRule(
					resolvers.tichetteRuleResolver,
					resolvers.robobrolRuleResolver,
				);
		}

		throw new Error("unknown value for rule");
	});
}

class ResolverNotProvidedError extends Error {
	constructor(ruleName: Rules) {
		super(
			`The resolver must be provided for the rule "${ruleName}" to be enabled.`,
		);
	}
}
