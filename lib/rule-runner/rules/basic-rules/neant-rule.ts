import type { DiceRollGameContext } from "../../game-context.ts";
import { DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";

export class NeantRule extends DiceRule {
	name = Rules.NEANT;

	isApplicableToDiceRoll(): boolean {
		return true;
	}

	applyDiceRule(context: DiceRollGameContext): RuleEffects {
		return [
			{
				event: RuleEffectEvent.NEANT,
				player: context.player,
				value: 0,
			},
			{
				event: RuleEffectEvent.ADD_GRELOTTINE,
				player: context.player,
				value: 0,
			},
		];
	}
}
