import type { DiceRollGameContext } from "../../game-context.ts";
import { type DiceRoll, DiceRule } from "../dice-rule";
import { Rules } from "../rule";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import type { Resolver } from "../rule-resolver";

export type SouffletteResolution =
	| NoChallengeSouffletteResolution
	| ChallengeSouffletteResolution;

interface NoChallengeSouffletteResolution {
	isChallenge: false;
}

interface ChallengeSouffletteResolution {
	isChallenge: true;
	challengedPlayer: string;
	numberOfDiceRolls: 1 | 2 | 3;
	diceRoll: DiceRoll;
}

export interface SouffletteResolutionPayload {
	player: string;
}

export class SouffletteRule extends DiceRule {
	name = Rules.SOUFFLETTE;

	constructor(
		private readonly resolver: Resolver<
			SouffletteResolution,
			SouffletteResolutionPayload
		>,
	) {
		super();
	}

	isApplicableToDiceRoll(diceRoll: DiceRoll): boolean {
		return isDiceRollASoufflette(diceRoll);
	}

	async applyDiceRule(context: DiceRollGameContext): Promise<RuleEffects> {
		const resolution = await this.resolver.getResolution({
			player: context.player,
		});

		if (!resolution.isChallenge) {
			return [
				{
					event: RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE,
					player: context.player,
					value: 0,
				},
			];
		}

		const isChallengeWonByChallengedPlayer = this.isApplicableToDiceRoll(
			resolution.diceRoll,
		);

		if (isChallengeWonByChallengedPlayer) {
			const challengeScore = (3 - resolution.numberOfDiceRolls) * 10 + 30;
			return [
				{
					event: RuleEffectEvent.SOUFFLETTE_WON,
					player: resolution.challengedPlayer,
					value: challengeScore,
				},
				{
					event: RuleEffectEvent.SOUFFLETTE_LOST,
					player: context.player,
					value: -challengeScore,
				},
			];
		}

		const challengedPlayerContext: DiceRollGameContext = {
			...context,
			player: resolution.challengedPlayer,
			diceRoll: resolution.diceRoll,
		};

		const lastDiceRollRuleEffects = await context.runner.handleGameEvent(
			challengedPlayerContext,
		);

		return [
			{
				event: RuleEffectEvent.SOUFFLETTE_WON,
				player: context.player,
				value: 30,
			},
			{
				event: RuleEffectEvent.SOUFFLETTE_LOST,
				player: resolution.challengedPlayer,
				value: -30,
			},
			...lastDiceRollRuleEffects,
		];
	}
}

export function isDiceRollASoufflette(diceRoll: DiceRoll): boolean {
	const [dieValue1, dieValue2, dieValue3] = [...diceRoll].sort();

	return dieValue1 === 1 && dieValue2 === 2 && dieValue3 === 4;
}
