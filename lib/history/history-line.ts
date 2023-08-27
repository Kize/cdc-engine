import {
  NotImplementedRuleEffectEvent,
  RuleEffectEvent,
} from '../rule-runner/rules/rule-effect';
import { nanoid } from '@reduxjs/toolkit';
import { Player } from '../player.ts';

export interface HistoryLine {
  player: Player;
  designation: AllHistoryLineTypes;
  amount: number;
}

export enum GodModLineType {
  GOD_MOD = 'Ligne custom',
}

export enum GameLineType {
  PLAY_TURN = 'a joué son tour de jeu',
  SLOUBI = 'Sloubi',
}

export type AllHistoryLineTypes =
  | RuleEffectEvent
  | NotImplementedRuleEffectEvent
  | GodModLineType
  | GameLineType;

export function getNewEventId(): string {
  return nanoid(32);
}

export function historyLineToMessage(line: HistoryLine): string {
  switch (line.designation) {
    case GameLineType.PLAY_TURN:
      return `${line.player} ${GameLineType.PLAY_TURN}`;
    case RuleEffectEvent.NEANT:
      return `${line.player} a fait un Néant. Il obtient une Grelottine.`;
    case RuleEffectEvent.BEVUE:
      return `${line.player} a pris une Bévue`;
    case GameLineType.SLOUBI:
      return `${line.player} a fait un Sloubi pour ${line.amount}`;

    case RuleEffectEvent.CUL_DE_CHOUETTE:
    case RuleEffectEvent.BLEU_ROUGE:
      return `${line.player} a fait un ${line.designation} pour ${line.amount}`;
    case RuleEffectEvent.VELUTE:
    case RuleEffectEvent.SUITE_VELUTE:
    case RuleEffectEvent.CHOUETTE:
    case RuleEffectEvent.ARTICHETTE:
      return `${line.player} a fait une ${line.designation} pour ${line.amount}`;

    case RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE:
      return `${line.player} a fait une Soufflette`;
    case RuleEffectEvent.SOUFFLETTE_WON:
      return `${line.player} a gagné une Soufflette pour ${line.amount}`;
    case RuleEffectEvent.SOUFFLETTE_LOST:
      return `${line.player} a perdu une Soufflette pour ${line.amount}`;

    case RuleEffectEvent.SUITE:
      return `${line.player} a perdu une ${line.designation} pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_WON:
      return `${line.player} a gagné une Chouette velute pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_LOST:
      return `${line.player} a perdu une Chouette velute pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_STOLEN:
      return `La Chouette velute a été volée à ${line.player}`;

    case RuleEffectEvent.SIROP_LOST:
      return `${line.player} a perdu un Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_WON:
      return `${line.player} a gagné un Sirotage pour ${line.amount}`;
    case RuleEffectEvent.ATTRAPE_OISEAU_WON:
      return `${line.player} a gagné un Attrape-Oiseau pour ${line.amount}`;
    case RuleEffectEvent.ATTRAPE_OISEAU_LOST:
      return `${line.player} a perdu un Attrape-Oiseau pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_LOST:
      return `${line.player} a perdu un pari de Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_WON:
      return `${line.player} a gagné un pari de Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_SKIPPED:
      return `${line.player} n'a pas parié`;
    case RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED:
      return `${line.player} n'a pas annoncé "Sirop Gagnant!"`;

    case RuleEffectEvent.ADD_CIVET:
    case RuleEffectEvent.REMOVE_CIVET:
    case RuleEffectEvent.CIVET_WON:
    case RuleEffectEvent.CIVET_LOST:
    case RuleEffectEvent.VERDIER_WON:
    case RuleEffectEvent.VERDIER_LOST:
    case RuleEffectEvent.ADD_JARRET:
    case RuleEffectEvent.REMOVE_JARRET:
    case RuleEffectEvent.BLEU_ROUGE_BET_WON:
      return `${line.designation} pour ${line.player}`;

    default:
      return `${JSON.stringify(line)}`;
  }
}
