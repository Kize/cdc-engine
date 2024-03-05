import { RuleEffects } from './rule-effect';
import { GameContextWrapper } from '../game-context-event';
import { UnknownGameContext } from '../game-context.ts';

export interface Rule {
  name: Rules;
  isApplicableToGameContext: (context: UnknownGameContext) => boolean;
  applyRule: (
    context: GameContextWrapper,
  ) => RuleEffects | Promise<RuleEffects>;
}

export enum Rules {
  BEVUE = 'La Bévue',
  DOUBLE_BEVUE = ' La Double Bévue',
  NEANT = 'Le Néant',
  CHOUETTE = 'La Chouette',
  SUITE = 'La Suite',
  VELUTE = 'La Velute',
  CUL_DE_CHOUETTE = 'Le Cul de Chouette',
  CUL_DE_CHOUETTE_DOUBLED = 'Le Cul de Chouette doublé',
  GRELOTTINE = 'La Grelottine',
  CHOUETTE_VELUTE = ' La Chouette-Velute',
  CIVET = 'Le Civet',
  CIVET_DOUBLED = 'Le Civet doublé',
  SIROP = 'Le Sirop',
  ATTRAPE_OISEAU = "L'Attrape-oiseau",
  ARTICHETTE = "L'Artichette",
  BLEU_ROUGE = 'Le Bleu-Rouge',
  SOUFFLETTE = 'La Soufflette',
  VERDIER = 'Le Verdier',
  TICHETTE = 'La Tichette',
}
