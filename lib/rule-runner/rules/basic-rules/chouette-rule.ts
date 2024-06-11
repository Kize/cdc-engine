import type { DiceRollGameContext } from "../../game-context.ts";
import { type DiceRoll, DiceRule, type DieValue } from "../dice-rule";
import { Rules } from "../rule";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";

export class ChouetteRule extends DiceRule {
	name = Rules.CHOUETTE;

	isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
		return (
			dieValue1 === dieValue2 ||
			dieValue1 === dieValue3 ||
			dieValue2 === dieValue3
		);
	}

	protected getChouetteRuleEffect(
		player: string,
		diceRoll: DiceRoll,
	): RuleEffect {
		const score = this.getChouetteScore(diceRoll);
		return {
			event: RuleEffectEvent.CHOUETTE,
			player: player,
			value: score,
		};
	}

	applyDiceRule({
		player,
		diceRoll,
	}: DiceRollGameContext): Promise<RuleEffects> {
		return Promise.resolve([this.getChouetteRuleEffect(player, diceRoll)]);
	}

	getChouetteScore(diceRoll: DiceRoll): number {
		const chouetteValue = this.getChouetteValue(diceRoll);

		return chouetteValue ** 2;
	}

	protected getChouetteValue([
		dieValue1,
		dieValue2,
		dieValue3,
	]: DiceRoll): DieValue {
		return dieValue1 === dieValue2 || dieValue1 === dieValue3
			? dieValue1
			: dieValue2;
	}
}
