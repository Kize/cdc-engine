import type { Player } from "../../../player.ts";
import type { GameContextWrapper } from "../../game-context-event";
import {
	type CivetResolutionPayload,
	CivetRule,
	type DiceRollCivetResolution,
	type VerdierCivetResolution,
} from "../level-1/civet-rule.ts";
import { Rules } from "../rule";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";
import type { Resolver } from "../rule-resolver";

interface BettingPlayers {
	otherBettingPlayers: Array<Player>;
}

type DiceRollCivetDoubledResolution = DiceRollCivetResolution & BettingPlayers;
type VerdierCivetDoubledResolution = VerdierCivetResolution & BettingPlayers;

export type CivetDoubledResolution =
	| DiceRollCivetDoubledResolution
	| VerdierCivetDoubledResolution;

export class CivetDoubledRule extends CivetRule {
	name = Rules.CIVET_DOUBLED;

	constructor(
		private civetDoubleResolver: Resolver<
			CivetDoubledResolution,
			CivetResolutionPayload
		>,
	) {
		super(civetDoubleResolver);
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const { runner, player } = context.asCivet();

		const civetResolution = await this.civetDoubleResolver.getResolution({
			player,
		});

		const ruleEffects = await super.computeCivetRuleEffects(
			player,
			civetResolution,
			runner,
		);

		if (civetResolution.otherBettingPlayers.length === 0) {
			return ruleEffects;
		}

		const removedCivets = civetResolution.otherBettingPlayers.map<RuleEffect>(
			(player) => ({ event: RuleEffectEvent.REMOVE_CIVET, player, value: 0 }),
		);

		const civetDoubleRuleEffects = ruleEffects.map<RuleEffect>((ruleEffect) => {
			const isCivetScoreRuleEffect =
				ruleEffect.player === player &&
				(ruleEffect.event === RuleEffectEvent.CIVET_WON ||
					ruleEffect.event === RuleEffectEvent.CIVET_LOST);

			if (isCivetScoreRuleEffect) {
				const multiplicativeFactor =
					2 ** civetResolution.otherBettingPlayers.length;

				return {
					...ruleEffect,
					value: ruleEffect.value * multiplicativeFactor,
				};
			}

			return ruleEffect;
		});

		return [...civetDoubleRuleEffects, ...removedCivets];
	}
}
