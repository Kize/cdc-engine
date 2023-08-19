import { getVeluteValue } from './velute-rule';
import { Resolver } from '../rule-resolver';
import { DiceRoll, DiceRule } from '../dice-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { DiceRollGameContext } from '../../game-context-event';
import { Rules } from '../rule';

export interface ChouetteVeluteResolution {
  players: Array<string>;
}

export interface ChouetteVeluteResolutionPayload {
  player: string;
}

export class ChouetteVeluteRule extends DiceRule {
  name = Rules.CHOUETTE_VELUTE;

  constructor(
    private readonly resolver: Resolver<
      ChouetteVeluteResolution,
      ChouetteVeluteResolutionPayload
    >,
  ) {
    super();
  }

  isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
    const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

    return dieValue1 === dieValue2 && dieValue1 + dieValue2 === dieValue3;
  }

  async applyDiceRule({
    diceRoll,
    player,
  }: DiceRollGameContext): Promise<RuleEffects> {
    const { players } = await this.resolver.getResolution({ player });

    const effects: RuleEffects = [];

    if (!players.includes(player)) {
      effects.push({
        event: RuleEffectEvent.CHOUETTE_VELUTE_STOLEN,
        player: player,
        value: 0,
      });
    }

    const veluteValue = getVeluteValue(diceRoll);
    const isChouetteVeluteWon = players.length === 1;
    const score = isChouetteVeluteWon ? veluteValue : -veluteValue;
    const event = isChouetteVeluteWon
      ? RuleEffectEvent.CHOUETTE_VELUTE_WON
      : RuleEffectEvent.CHOUETTE_VELUTE_LOST;

    players.forEach((player) => {
      effects.push({
        event,
        value: score,
        player: player,
      });
    });

    return effects;
  }
}
