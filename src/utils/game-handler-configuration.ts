import { GameHandler } from '../../lib/game/game-handler.ts';
import { RulesConfiguration } from '../../lib/rule-runner/rule-runner-configuration.ts';
import { grelottineResolver } from '../store/resolvers/rules/grelottine-rule.resolver.ts';
import { suiteRuleResolver } from '../store/resolvers/rules/suite-rule.resolver.ts';
import { chouetteVeluteResolver } from '../store/resolvers/rules/chouette-velute-rule.resolver.ts';
import { souffletteRuleResolver } from '../store/resolvers/rules/soufflette-rule.resolver.ts';
import { artichetteRuleResolver } from '../store/resolvers/rules/artichette-rule.resolver.ts';
import { siropRuleResolver } from '../store/resolvers/rules/sirop-rule.resolver.ts';
import { bleuRougeRuleResolver } from '../store/resolvers/rules/bleu-rouge-rule.resolver.ts';
import { attrapeOiseauRuleResolver } from '../store/resolvers/rules/attrape-oiseau-rule.resolver.ts';
import { civetRuleResolver } from '../store/resolvers/rules/civet-rule.resolver.ts';

export const cdcGameHandler = new GameHandler();

export function configureGameHandlerRules(
  rulesConfiguration: RulesConfiguration,
): void {
  cdcGameHandler.setRules(rulesConfiguration, {
    culDeChouetteRuleResolver: undefined!,
    grelottineRuleResolver: grelottineResolver,
    suiteRuleResolver: suiteRuleResolver,
    chouetteVeluteRuleResolver: chouetteVeluteResolver,
    souffletteRuleResolver: souffletteRuleResolver,
    artichetteRuleResolver: artichetteRuleResolver,
    siropRuleResolver: siropRuleResolver,
    attrapeOiseauRuleResolver: attrapeOiseauRuleResolver,
    civetRuleResolver: civetRuleResolver,
    bleuRougeRuleResolver: bleuRougeRuleResolver,
  });
}
