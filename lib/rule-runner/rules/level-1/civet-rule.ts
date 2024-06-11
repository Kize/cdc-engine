import {
	GameContextEvent,
	type GameContextWrapper,
} from "../../game-context-event";
import type { UnknownGameContext } from "../../game-context.ts";
import type { RuleRunner } from "../../rule-runner.ts";
import type { DiceRoll, DieValue } from "../dice-rule";
import { type Rule, Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";

export type CivetResolution = DiceRollCivetResolution | VerdierCivetResolution;

export interface DiceRollCivetResolution {
	isVerdier: false;
	betAmount: number;
	playerBet: CivetBet;
	diceRoll: DiceRoll;
}

export interface VerdierCivetResolution {
	isVerdier: true;
	betAmount: number;
	playerBet: CivetBet;
	diceValues: [DieValue, DieValue];
}

export enum CivetBet {
	CHOUETTE = "Chouette",
	VELUTE = "Velute",
	CHOUETTE_VELUTE = "Chouette-Velute",
	CUL_DE_CHOUETTE = "Cul de chouette",
	SUITE = "Suite",
	SOUFFLETTE = "Soufflette",
	BLEU_ROUGE = "Bleu-Rouge",
	SIROP_GRELOT = "Sirop-Grelot",
	ARTICHETTE = "Artichette",
	// PELICAN = "Pélican",
	// FLAN = "Flan",
}

export interface CivetResolutionPayload {
	player: string;
}

export class CivetRule implements Rule {
	name = Rules.CIVET;

	constructor(
		private readonly resolver: Resolver<
			CivetResolution,
			CivetResolutionPayload
		>,
	) {}

	isApplicableToGameContext(context: UnknownGameContext): boolean {
		return context.event === GameContextEvent.CIVET_BET;
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const { runner, player } = context.asCivet();

		const civetResolution = await this.resolver.getResolution({
			player,
		});

		return this.computeCivetRuleEffects(player, civetResolution, runner);
	}

	protected async computeCivetRuleEffects(
		player: string,
		civetResolution: CivetResolution,
		runner: RuleRunner,
	): Promise<RuleEffects> {
		let diceRollRuleEffects: RuleEffects;

		if (!civetResolution.isVerdier) {
			diceRollRuleEffects = await runner.handleGameEvent({
				event: GameContextEvent.DICE_ROLL,
				diceRoll: civetResolution.diceRoll,
				player,
				runner,
			});
		} else {
			diceRollRuleEffects = await runner.handleGameEvent({
				event: GameContextEvent.VERDIER,
				diceValues: civetResolution.diceValues,
				player,
				runner,
			});
		}

		const civetRuleEffects: RuleEffects = [];

		const isCivetWon = civetBetToRuleEffectsToCheck[
			civetResolution.playerBet
		].has(diceRollRuleEffects[0].event);
		if (isCivetWon) {
			civetRuleEffects.push({
				event: RuleEffectEvent.CIVET_WON,
				player: player,
				value: civetResolution.betAmount,
			});
		} else {
			civetRuleEffects.push({
				event: RuleEffectEvent.CIVET_LOST,
				player: player,
				value: -civetResolution.betAmount,
			});
		}

		civetRuleEffects.push({
			event: RuleEffectEvent.REMOVE_CIVET,
			player: player,
			value: 0,
		});

		return [...diceRollRuleEffects, ...civetRuleEffects];
	}
}

const civetBetToRuleEffectsToCheck: Record<CivetBet, Set<RuleEffectEvent>> = {
	[CivetBet.SUITE]: new Set([
		RuleEffectEvent.SUITE,
		RuleEffectEvent.SUITE_VELUTE,
	]),
	[CivetBet.CHOUETTE]: new Set([
		RuleEffectEvent.CHOUETTE,
		RuleEffectEvent.ATTRAPE_OISEAU_WON,
		RuleEffectEvent.ATTRAPE_OISEAU_LOST,
	]),
	[CivetBet.CHOUETTE_VELUTE]: new Set([
		RuleEffectEvent.CHOUETTE_VELUTE_WON,
		RuleEffectEvent.CHOUETTE_VELUTE_LOST,
		RuleEffectEvent.CHOUETTE_VELUTE_STOLEN,
	]),
	[CivetBet.CUL_DE_CHOUETTE]: new Set([RuleEffectEvent.CUL_DE_CHOUETTE]),
	[CivetBet.VELUTE]: new Set([
		RuleEffectEvent.VELUTE,
		RuleEffectEvent.SUITE_VELUTE,
	]),
	[CivetBet.SIROP_GRELOT]: new Set([RuleEffectEvent.SIROP_WON]),
	[CivetBet.SOUFFLETTE]: new Set([
		RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE,
		RuleEffectEvent.SOUFFLETTE_WON,
		RuleEffectEvent.SOUFFLETTE_LOST,
	]),
	[CivetBet.BLEU_ROUGE]: new Set([RuleEffectEvent.BLEU_ROUGE]),
	[CivetBet.ARTICHETTE]: new Set([RuleEffectEvent.ARTICHETTE]),
};
