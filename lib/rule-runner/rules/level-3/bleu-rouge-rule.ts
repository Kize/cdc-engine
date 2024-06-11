import type { Player } from "../../../player.ts";
import type { DiceRollGameContext } from "../../game-context.ts";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import { NeantRule } from "../basic-rules/neant-rule";
import type { DiceRoll } from "../dice-rule";
import { Rules } from "../rule";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";
import type { Resolver } from "../rule-resolver";

export interface BleuRougeResolution {
	diceRoll: DiceRoll;
	bids: Array<BleuRougeBid>;
}

export interface BleuRougeResolutionPayload {
	player: Player;
}

export class BleuRougeRule extends ChouetteRule {
	name = Rules.BLEU_ROUGE;

	constructor(
		private readonly resolver: Resolver<
			BleuRougeResolution,
			BleuRougeResolutionPayload
		>,
	) {
		super();
	}

	isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
		const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

		return dieValue1 === 3 && dieValue2 === 3 && dieValue3 === 4;
	}

	async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
		const [chouetteRuleEffect] = await super.applyDiceRule(context);

		const initialBleuRougeRulEffect: RuleEffect = {
			...chouetteRuleEffect,
			event: RuleEffectEvent.BLEU_ROUGE,
		};

		const { bids, diceRoll } = await this.resolver.getResolution({
			player: context.player,
		});

		const addJarretRuleEffects: RuleEffects = [];
		const secondRollContext: DiceRollGameContext = { ...context, diceRoll };
		const isANeant =
			context.runner.getFirstApplicableRule(secondRollContext, {}) instanceof
			NeantRule;

		if (isANeant) {
			addJarretRuleEffects.push({
				event: RuleEffectEvent.ADD_JARRET,
				player: context.player,
				value: 0,
			});
		}

		const diceRollSum = diceRoll[0] + diceRoll[1] + diceRoll[2];
		const winningBid = bids.find((bid) => bid.bet === diceRollSum);

		if (!winningBid) {
			return [initialBleuRougeRulEffect, ...addJarretRuleEffects];
		}

		const bleuRougeBidRuleEffect: RuleEffect = {
			event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
			player: winningBid.player,
			value: 36 + 2 * winningBid.bet,
		};

		const winningBetGameContext: DiceRollGameContext = {
			...context,
			player: winningBid.player,
			diceRoll,
		};
		const winningBidCombinationRuleEffects =
			await context.runner.handleGameEvent(winningBetGameContext);

		const finalRuleEffects = [
			initialBleuRougeRulEffect,
			bleuRougeBidRuleEffect,
			...addJarretRuleEffects,
			...winningBidCombinationRuleEffects,
		];

		return finalRuleEffects.filter(
			(ruleEffect) => ruleEffect.event !== RuleEffectEvent.ADD_GRELOTTINE,
		);
	}
}

export interface BleuRougeBid {
	player: string;
	bet: BleuRougeBetValue;
}

export type BleuRougeBetValue =
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18;
