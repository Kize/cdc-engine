import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { Rules } from '../rule';
import { DiceRollGameContext } from '../../game-context.ts';

export class VeluteRule extends DiceRule {
  name = Rules.VELUTE;

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    return isVelute(diceRoll);
  }

  applyDiceRule({ player, diceRoll }: DiceRollGameContext): RuleEffects {
    const score = getVeluteValue(diceRoll);

    return [
      {
        event: RuleEffectEvent.VELUTE,
        player: player,
        value: score,
      },
    ];
  }
}

export function isVelute(diceRoll: DiceRoll): boolean {
  const sortedValues = [...diceRoll].sort();
  return sortedValues[0] + sortedValues[1] === sortedValues[2];
}

export function getVeluteValue(diceRoll: DiceRoll): number {
  const veluteValue = [...diceRoll].sort().pop();

  return 2 * (veluteValue || 0) ** 2;
}
