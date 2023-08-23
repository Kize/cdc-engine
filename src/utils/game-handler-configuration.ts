import { GameHandler } from '../../lib/game/game-handler.ts';
import { RulesConfiguration } from '../../lib/rule-runner/rule-runner-configuration.ts';
import { grelottineResolver } from '../store/resolvers/rules/grelottine-rule.resolver.ts';
import { suiteResolver } from '../store/resolvers/rules/suite-rule.resolver.ts';
import { chouetteVeluteResolver } from '../store/resolvers/rules/chouette-velute-rule.resolver.ts';

export const cdcGameHandler = new GameHandler();

export function configureGameHandlerRules(
  rulesConfiguration: RulesConfiguration,
): void {
  cdcGameHandler.setRules(rulesConfiguration, {
    grelottineRuleResolver: grelottineResolver,
    suiteRuleResolver: suiteResolver,
    chouetteVeluteRuleResolver: chouetteVeluteResolver,
  });
}
