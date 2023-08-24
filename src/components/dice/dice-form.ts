import {
  DiceRoll,
  DieValue,
} from '../../../lib/rule-runner/rules/dice-rule.ts';

export type OptionalDieValue = DieValue | null;

export type DiceForm = [OptionalDieValue, OptionalDieValue, OptionalDieValue];

export function isDiceFormValid(diceForm: DiceForm): diceForm is DiceRoll {
  return diceForm.every((dieValue) => dieValue !== null);
}
