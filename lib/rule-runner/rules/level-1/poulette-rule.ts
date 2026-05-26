import {
	GrelottineRule,
	type GrelottineResolution,
} from "../basic-rules/grelottine-rule";
import type { Player } from "../../../player.ts";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import type { GameContextWrapper } from "../../game-context-event";

export interface PouletteResolution {
	poulettePlayers: Array<Player>;
}

export interface PouletteResolutionPayload {
	grelottinePlayers: [Player, Player];
}

export class PouletteRule extends GrelottineRule {
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
		const grelottineRuleEffects = await super.applyRule(context);
		const pouletteRuleEffects = await this.handlePouletteRule(
			grelottineRuleEffects,
		);

		return [...grelottineRuleEffects, ...pouletteRuleEffects];
	}

	private async handlePouletteRule(grelottineRuleEffects: Array<RuleEffect>) {
		const isFirstRulEffectANeant =
			grelottineRuleEffects[0]?.event === RuleEffectEvent.NEANT;

		if (!isFirstRulEffectANeant) {
			return [];
		}

		const grelottinePlayers = grelottineRuleEffects.reduce(
			(acc: [Player, Player], effect) => {
				if (effect.event === RuleEffectEvent.GRELOTTINE_CHALLENGE_WON) {
					acc[0] = effect.player;
				}

				if (effect.event === RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST) {
					acc[1] = effect.player;
				}

				return acc;
			},
			["", ""],
		);

		const { poulettePlayers } = await this.pouletteResolver.getResolution({
			grelottinePlayers,
		});

		if (poulettePlayers.length === 0) {
			return [];
		}

		const isPouletteWon = poulettePlayers.length === 1;

		return poulettePlayers.map<RuleEffect>((player) => ({
			event: isPouletteWon
				? RuleEffectEvent.POULETTE_WON
				: RuleEffectEvent.POULETTE_LOST,
			player,
			value: isPouletteWon ? 10 : -10,
		}));
	}
}
