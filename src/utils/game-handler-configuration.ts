import { GameHandler } from "../../lib/game/game-handler.ts";
import type { RulesConfiguration } from "../../lib/rule-runner/rule-runner-configuration.ts";
import { artichetteRuleResolver } from "../store/resolvers/rules/artichette-rule.resolver.ts";
import { attrapeOiseauRuleResolver } from "../store/resolvers/rules/attrape-oiseau-rule.resolver.ts";
import { bleuRougeRuleResolver } from "../store/resolvers/rules/bleu-rouge-rule.resolver.ts";
import { chouetteVeluteResolver } from "../store/resolvers/rules/chouette-velute-rule.resolver.ts";
import { civetDoubleRuleResolver } from "../store/resolvers/rules/civet-double-rule.resolver.ts";
import { civetRuleResolver } from "../store/resolvers/rules/civet-rule.resolver.ts";
import { culDeChouetteRuleResolver } from "../store/resolvers/rules/cul-de-chouette-rule.resolver.ts";
import { grelottineResolver } from "../store/resolvers/rules/grelottine-rule.resolver.ts";
import { robobrolRuleResolver } from "../store/resolvers/rules/robobrol-rule.resolver.ts";
import { siropRuleResolver } from "../store/resolvers/rules/sirop-rule.resolver.ts";
import { souffletteRuleResolver } from "../store/resolvers/rules/soufflette-rule.resolver.ts";
import { suiteRuleResolver } from "../store/resolvers/rules/suite-rule.resolver.ts";
import { tichetteRuleResolver } from "../store/resolvers/rules/tichette-rule.resolver.ts";
import { verdierRuleResolver } from "../store/resolvers/rules/verdier-rule.resolver.ts";

export const cdcGameHandler = new GameHandler();

export function configureGameHandlerRules(
	rulesConfiguration: RulesConfiguration,
): void {
	cdcGameHandler.setRules(rulesConfiguration, {
		culDeChouetteRuleResolver: culDeChouetteRuleResolver,
		grelottineRuleResolver: grelottineResolver,
		suiteRuleResolver: suiteRuleResolver,
		chouetteVeluteRuleResolver: chouetteVeluteResolver,
		souffletteRuleResolver: souffletteRuleResolver,
		artichetteRuleResolver: artichetteRuleResolver,
		siropRuleResolver: siropRuleResolver,
		attrapeOiseauRuleResolver: attrapeOiseauRuleResolver,
		civetRuleResolver: civetRuleResolver,
		civetDoubleRuleResolver: civetDoubleRuleResolver,
		bleuRougeRuleResolver: bleuRougeRuleResolver,
		verdierRuleResolver: verdierRuleResolver,
		tichetteRuleResolver: tichetteRuleResolver,
		robobrolRuleResolver: robobrolRuleResolver,
	});
}
