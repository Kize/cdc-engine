import type { Player } from "../../../player.ts";
import type { DiceRollGameContext } from "../../game-context.ts";
import { type DiceRoll, DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver.ts";

export interface CulDeChouetteResolution {
	claimingPlayer: string;
}

export interface CulDeChouetteResolutionPayload {
	player: Player;
}

export class CulDeChouetteRule extends DiceRule {
	name = Rules.CUL_DE_CHOUETTE;

	constructor(
		private readonly resolver: Resolver<
			CulDeChouetteResolution,
			CulDeChouetteResolutionPayload
		>,
	) {
		super();
	}

	isApplicableToDiceRoll([dieValue1, dieValue2, dieValue3]: DiceRoll): boolean {
		return dieValue1 === dieValue2 && dieValue1 === dieValue3;
	}

	async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
		const score = getCulDeChouetteScore(context.diceRoll);

		const { claimingPlayer } = await this.resolver.getResolution({
			player: context.player,
		});

		if (claimingPlayer === context.player) {
			return [
				{
					event: RuleEffectEvent.CUL_DE_CHOUETTE,
					player: context.player,
					value: score,
				},
			];
		}

		return [
			{
				event: RuleEffectEvent.CUL_DE_CHOUETTE,
				player: context.player,
				value: (score * 3) / 5,
			},
			{
				event: RuleEffectEvent.CUL_DE_CHOUETTE_STOLEN,
				player: claimingPlayer,
				value: (score * 2) / 5,
			},
		];
	}
}

export function getCulDeChouetteScore(diceRoll: DiceRoll): number {
	return 40 + 10 * diceRoll[0];
}
