import {
  NotImplementedRuleEffectEvent,
  RuleEffectEvent,
} from '../rule-runner/rules/rule-effect';
import { nanoid } from '@reduxjs/toolkit';

export enum GodModLineType {
  GOD_MOD = 'Ligne custom',
}

export enum GameLineType {
  PLAY_TURN = 'A joué son tour de jeu',
}

export type AllHistoryLineTypes =
  | RuleEffectEvent
  | NotImplementedRuleEffectEvent
  | GodModLineType
  | GameLineType;

export interface HistoryLine {
  eventId: string;
  designation: AllHistoryLineTypes;
  amount: number;
}

export interface PlayerHistoryLine extends HistoryLine {
  player: string;
}

export function getNewEventId(): string {
  return nanoid(32);
}
