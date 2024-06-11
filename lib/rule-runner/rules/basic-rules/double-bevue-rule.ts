import type { GameContextWrapper } from "../../game-context-event";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import { BevueRule } from "./bevue-rule.ts";

export class DoubleBevueRule extends BevueRule {
	name = Rules.DOUBLE_BEVUE;

	applyRule(context: GameContextWrapper): RuleEffects {
		return [
			{
				event: RuleEffectEvent.BEVUE,
				player: context.asApplyBevue().playerWhoMadeABevue,
				value: -10,
			},
		];
	}
}
