import { GrelottineRule, GrelottineResolution } from "../basic-rules/grelottine-rule";
import type { Player } from "../../../player.ts";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import { GameContextWrapper } from "../../game-context-event";

export interface PouletteResolution extends GrelottineResolution {
	poulettePlayers: Array<Player>;
}

export interface PouletteResolutionPayload {
	grelottinePlayers: [Player, Player];
}

export class PouletteRule extends GrelottineRule {
	name = Rules.POULETTE;

	constructor(
		private readonly pouletteResolver: Resolver<
			PouletteResolution,
			PouletteResolutionPayload
		>,
	) {
		super(pouletteResolver as unknown as Resolver<GrelottineResolution>);
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const resolution = await this.pouletteResolver.getResolution({} as any);

		const effects = await this.applyWithResolution(context, resolution);

		const isNeant = effects.some(
			(effect) => effect.event === RuleEffectEvent.NEANT,
		);

		if (isNeant) {
			const score = resolution.poulettePlayers.length === 2 ? -10 : 10;
            console.log("resolution", resolution);
            console.log("score", score);

			const pouletteEffects: RuleEffects = resolution.poulettePlayers.map(
				(player) => ({
					event: RuleEffectEvent.POULETTE,
					player,
					value: score,
				}),
			);

			console.log('in isNeant pouletteEffects', pouletteEffects);
			console.log('in isNeant score', score);
			console.log('in isNeant effects', effects);



			return [...effects, ...pouletteEffects];
		}

		return effects;
	}
}
