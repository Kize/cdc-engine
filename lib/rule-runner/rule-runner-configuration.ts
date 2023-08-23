import { RuleResolver } from './rules/rule-resolver.ts';
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
import { BleuRougeResolution } from './rules/level-3/bleu-rouge-rule.ts';
import {
  ArtichetteResolution,
  ArtichetteResolutionPayload,
} from './rules/level-2/artichette-rule.ts';
import {
  VerdierResolution,
  VerdierResolutionPayload,
} from './rules/level-3/verdier-rule.ts';
import { Rules } from './rules/rule.ts';

export interface RulesConfiguration {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
  isCivetEnabled: boolean;
  isArtichetteEnabled: boolean;
  isVerdierEnabled: boolean;
  isBleuRougeEnabled: boolean;
}

export interface Resolvers {
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
  bleuRougeRuleResolver?: RuleResolver<BleuRougeResolution>;
  artichetteRuleResolver?: RuleResolver<
    ArtichetteResolution,
    ArtichetteResolutionPayload
  >;
  verdierRuleResolver?: RuleResolver<
    VerdierResolution,
    VerdierResolutionPayload
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
  Rules.BEVUE,
  Rules.GRELOTTINE,
  Rules.CIVET,
  Rules.VERDIER,
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
  Rules.NEANT,
];