import {
	GameContextEvent,
	type GameContextWrapper,
} from "../../game-context-event";
import type {
	CivetGameContext,
	UnknownGameContext,
} from "../../game-context.ts";
import type { DiceRoll } from "../dice-rule";
import { type Rule, Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";

export interface GrelottineResolution {
	grelottinPlayer: string;
	challengedPlayer: string;
	grelottinBet: GrelottineBet;
	gambledAmount: number;
	diceRoll?: DiceRoll;
}

export class GrelottineRule implements Rule {
	name = Rules.GRELOTTINE;

	constructor(private readonly resolver: Resolver<GrelottineResolution>) {}

	isApplicableToGameContext(context: UnknownGameContext): boolean {
		return context.event === GameContextEvent.CHALLENGE_GRELOTTINE;
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const {
			challengedPlayer,
			diceRoll,
			gambledAmount,
			grelottinBet,
			grelottinPlayer,
		} = await this.resolver.getResolution();
		const runner = context.asChallengeGrelottine().runner;

		let lastCombinationRuleEffects: RuleEffects;

		if (!diceRoll) {
			if (!runner.isRuleEnabled(Rules.CIVET)) {
				throw new Error(
					"The civet rule must be enabled to validate a grelottine without a Dice Roll",
				);
			}

			const civetGameContext: CivetGameContext = {
				event: GameContextEvent.CIVET_BET,
				runner,
				player: challengedPlayer,
			};

			lastCombinationRuleEffects =
				await runner.handleGameEvent(civetGameContext);
		} else {
			lastCombinationRuleEffects = await runner.handleGameEvent({
				event: GameContextEvent.DICE_ROLL,
				player: challengedPlayer,
				diceRoll,
				runner,
			});
		}

		const isGrelottineWon = grelottineBetToRuleEffectsToCheck[grelottinBet].has(
			lastCombinationRuleEffects[0].event,
		);

		const getLoserScore = () => -gambledAmount;
		const getWinnerScore = () => gambledAmount;

		return [
			{
				event: RuleEffectEvent.REMOVE_GRELOTTINE,
				player: grelottinPlayer,
				value: 0,
			},
			...lastCombinationRuleEffects,
			{
				event: isGrelottineWon
					? RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST
					: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
				player: grelottinPlayer,
				value: isGrelottineWon ? getLoserScore() : getWinnerScore(),
			},
			{
				event: isGrelottineWon
					? RuleEffectEvent.GRELOTTINE_CHALLENGE_WON
					: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
				player: challengedPlayer,
				value: isGrelottineWon ? getWinnerScore() : getLoserScore(),
			},
		];
	}
}

export enum GrelottineBet {
	CHOUETTE = "Chouette",
	VELUTE = "Velute",
	CUL_DE_CHOUETTE = "Cul de chouette",
	CHOUETTE_VELUTE = "Chouette-velute",
	SIROP_GRELOT = "Sirop-grelot",
}

const grelottineBetToRuleEffectsToCheck: Record<
	GrelottineBet,
	Set<RuleEffectEvent>
> = {
	[GrelottineBet.CHOUETTE]: new Set([
		RuleEffectEvent.CHOUETTE,
		RuleEffectEvent.ATTRAPE_OISEAU_LOST,
		RuleEffectEvent.ATTRAPE_OISEAU_WON,
	]),
	[GrelottineBet.CHOUETTE_VELUTE]: new Set([
		RuleEffectEvent.CHOUETTE_VELUTE_WON,
		RuleEffectEvent.CHOUETTE_VELUTE_LOST,
		RuleEffectEvent.CHOUETTE_VELUTE_STOLEN,
	]),
	[GrelottineBet.CUL_DE_CHOUETTE]: new Set([
		RuleEffectEvent.CUL_DE_CHOUETTE,
		RuleEffectEvent.SIROP_WON,
	]),
	[GrelottineBet.VELUTE]: new Set([
		RuleEffectEvent.VELUTE,
		RuleEffectEvent.SUITE_VELUTE,
	]),
	[GrelottineBet.SIROP_GRELOT]: new Set([RuleEffectEvent.SIROP_WON]),
};

export function getMaxGrelottinePossibleAmount(
	lowestScore: number,
	challenge: GrelottineBet | null,
): number {
	let percentage: number;
	switch (challenge) {
		case GrelottineBet.CHOUETTE:
			percentage = 0.33;
			break;
		case GrelottineBet.VELUTE:
			percentage = 0.25;
			break;
		case GrelottineBet.CUL_DE_CHOUETTE:
			percentage = 0.12;
			break;
		case GrelottineBet.CHOUETTE_VELUTE:
			percentage = 0.06;
			break;
		case GrelottineBet.SIROP_GRELOT:
			percentage = 0.03;
			break;
		default:
			percentage = 0;
			break;
	}
	return Math.ceil(lowestScore * percentage);
}
