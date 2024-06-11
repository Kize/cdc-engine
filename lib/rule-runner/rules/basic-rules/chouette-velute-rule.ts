import type { DiceRollGameContext } from "../../game-context.ts";
import { type DiceRoll, DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import { getVeluteValue } from "./velute-rule";

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

		for (const player of players) {
			effects.push({
				player,
				event,
				value: score,
			});
		}

		return effects;
	}
}
