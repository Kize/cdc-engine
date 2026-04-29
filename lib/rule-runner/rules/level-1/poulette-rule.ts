import { GrelottineRule, GrelottineResolution } from "../basic-rules/grelottine-rule";
import type { Player } from "../../../player.ts";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import { GameContextWrapper } from "../../game-context-event";

export interface PouletteResolution {
	poulettePlayers: Array<Player>;
}

export interface PouletteResolutionPayload {
	grelottinePlayers: [Player, Player];
}

export class PouletteRule extends GrelottineRule {
	name = Rules.POULETTE;

	constructor(
		grelottineResolver: Resolver<GrelottineResolution>,
		private readonly pouletteResolver: Resolver<
			PouletteResolution,
			PouletteResolutionPayload
		>,
	) {
		super(grelottineResolver);
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const resolution = await this.resolver.getResolution();
		const effects = await this.applyWithResolution(context, resolution);

		const isNeant = effects.some(
			(effect) => effect.event === RuleEffectEvent.NEANT,
		);

		if (isNeant) {
			const { poulettePlayers } = await this.pouletteResolver.getResolution({
				grelottinePlayers: [resolution.grelottinPlayer, resolution.challengedPlayer] as [Player, Player]
			});

			let score = 0;
			if (poulettePlayers.length === 1) {
				score = 10;
			} else if (poulettePlayers.length === 2) {
				score = -10;
			}

			const pouletteEffects: RuleEffects = poulettePlayers.map(
				(playerCandidate) => {
					const player =
						typeof playerCandidate === "string"
							? playerCandidate
							: (playerCandidate as any).player;

					return {
						event: RuleEffectEvent.POULETTE,
						player,
						value: score,
					};
				},
			);

			return [...effects, ...pouletteEffects];
		}

		return effects;
	}
}
