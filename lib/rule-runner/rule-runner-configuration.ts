import { Resolver, RuleResolver } from './rules/rule-resolver.ts';
import {
  SuiteResolution,
  SuiteResolutionPayload,
} from './rules/basic-rules/suite-rule.ts';
import {
  ChouetteVeluteResolution,
  ChouetteVeluteResolutionPayload,
} from './rules/basic-rules/chouette-velute-rule.ts';
import {
  SiropResolutionPayload,
  SirotageResolution,
} from './rules/level-1/sirotage-rule.ts';
import { AttrapeOiseauResolution } from './rules/level-1/attrape-oiseau-rule.ts';
import { GrelottineResolution } from './rules/basic-rules/grelottine-rule.ts';
import {
  SouffletteResolution,
  SouffletteResolutionPayload,
} from './rules/level-1/soufflette-rule.ts';
import {
  CivetResolution,
  CivetResolutionPayload,
} from './rules/level-1/civet-rule.ts';
import {
  BleuRougeResolution,
  BleuRougeResolutionPayload,
} from './rules/level-3/bleu-rouge-rule.ts';
import {
  ArtichetteResolution,
  ArtichetteResolutionPayload,
} from './rules/level-2/artichette-rule.ts';
import {
  VerdierResolution,
  VerdierResolutionPayload,
} from './rules/level-3/verdier-rule.ts';
import { Rules } from './rules/rule.ts';
import {
  CulDeChouetteResolution,
  CulDeChouetteResolutionPayload,
} from './rules/basic-rules/cul-de-chouette-rule.ts';
import { CivetDoubledResolution } from './rules/level-2/civet-doubled-rule.ts';
import {
  RobobrolResolution,
  RobobrolResolutionPayload,
  TichetteResolution,
  TichetteResolutionPayload,
} from './rules/level-5/tichette-rule.ts';

export interface RulesConfiguration {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
  isCivetEnabled: boolean;
  isCivetDoubleEnabled: boolean;
  isArtichetteEnabled: boolean;
  isVerdierEnabled: boolean;
  isBleuRougeEnabled: boolean;
  isDoubleBevueEnabled: boolean;
  isTichetteEnabled: boolean;
}

export interface Resolvers {
  culDeChouetteRuleResolver: Resolver<
    CulDeChouetteResolution,
    CulDeChouetteResolutionPayload
  >;
  suiteRuleResolver: RuleResolver<SuiteResolution, SuiteResolutionPayload>;
  chouetteVeluteRuleResolver: RuleResolver<
    ChouetteVeluteResolution,
    ChouetteVeluteResolutionPayload
  >;
  grelottineRuleResolver: RuleResolver<GrelottineResolution>;

  siropRuleResolver?: RuleResolver<SirotageResolution, SiropResolutionPayload>;
  attrapeOiseauRuleResolver?: RuleResolver<
    AttrapeOiseauResolution,
    SiropResolutionPayload
  >;
  souffletteRuleResolver?: RuleResolver<
    SouffletteResolution,
    SouffletteResolutionPayload
  >;
  civetRuleResolver?: RuleResolver<CivetResolution, CivetResolutionPayload>;
  civetDoubleRuleResolver?: RuleResolver<
    CivetDoubledResolution,
    CivetResolutionPayload
  >;
  bleuRougeRuleResolver?: RuleResolver<
    BleuRougeResolution,
    BleuRougeResolutionPayload
  >;
  artichetteRuleResolver?: RuleResolver<
    ArtichetteResolution,
    ArtichetteResolutionPayload
  >;
  verdierRuleResolver?: RuleResolver<
    VerdierResolution,
    VerdierResolutionPayload
  >;
  tichetteRuleResolver?: RuleResolver<
    TichetteResolution,
    TichetteResolutionPayload
  >;
  robobrolRuleResolver?: RuleResolver<
    RobobrolResolution,
    RobobrolResolutionPayload
  >;
}

export const BASIC_RULES: Array<Rules> = [
  Rules.CUL_DE_CHOUETTE,
  Rules.SUITE,
  Rules.CHOUETTE_VELUTE,
  Rules.VELUTE,
  Rules.CHOUETTE,
  Rules.NEANT,
  Rules.GRELOTTINE,
  Rules.BEVUE,
];

export const ALL_RULES_ORDERED: Array<Rules> = [
  Rules.GRELOTTINE,
  Rules.CIVET_DOUBLED,
  Rules.CIVET,
  Rules.VERDIER,
  Rules.TICHETTE,
  Rules.CUL_DE_CHOUETTE,
  Rules.SUITE,
  Rules.CHOUETTE_VELUTE,
  Rules.VELUTE,
  Rules.BLEU_ROUGE,
  Rules.ARTICHETTE,
  Rules.ATTRAPE_OISEAU,
  Rules.SIROP,
  Rules.CHOUETTE,
  Rules.SOUFFLETTE,
  Rules.DOUBLE_BEVUE,
  Rules.BEVUE,
  Rules.NEANT,
];
