import type { Player } from "../../../player.ts";
import type { DiceRollGameContext } from "../../game-context.ts";
import { type DiceRoll, DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import { getVeluteValue, isVelute } from "./velute-rule";

export interface SuiteResolution {
	losingPlayer: string;
	multiplier: number;
}

export interface SuiteResolutionPayload {
	player: Player;
}

export class SuiteRule extends DiceRule {
	name = Rules.SUITE;

	constructor(
		private readonly resolver: Resolver<
			SuiteResolution,
			SuiteResolutionPayload
		>,
	) {
		super();
	}

	isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
		const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

		return dieValue2 - dieValue1 === 1 && dieValue3 - dieValue2 === 1;
	}

	async applyDiceRule({
		diceRoll,
		player,
		runner,
	}: DiceRollGameContext): Promise<RuleEffects> {
		const ruleEffects: RuleEffects = [];

		if (isVelute(diceRoll) && runner.isRuleEnabled(Rules.VELUTE)) {
			ruleEffects.push({
				event: RuleEffectEvent.SUITE_VELUTE,
				player: player,
				value: getVeluteValue(diceRoll),
			});
		}

		const suiteResolution = await this.resolver.getResolution({ player });

		ruleEffects.push({
			event: RuleEffectEvent.SUITE,
			player: suiteResolution.losingPlayer,
			value: -10 * suiteResolution.multiplier,
		});

		return ruleEffects;
	}
}
