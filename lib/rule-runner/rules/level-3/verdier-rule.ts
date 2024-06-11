import type { DiceForm } from "../../../../src/components/dice/dice-form.ts";
import {
	GameContextEvent,
	type GameContextWrapper,
} from "../../game-context-event";
import type { UnknownGameContext } from "../../game-context.ts";
import { isVelute } from "../basic-rules/velute-rule";
import type { DiceRoll, DieValue } from "../dice-rule";
import { type Rule, Rules } from "../rule";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";
import type { Resolver } from "../rule-resolver";

export interface VerdierResolution {
	bettingPlayers: Array<string>;
	lastDieValue: DieValue;
}

export interface VerdierResolutionPayload {
	player: string;
	diceValues: [DieValue, DieValue];
}

export class VerdierRule implements Rule {
	name = Rules.VERDIER;

	constructor(
		private readonly resolver: Resolver<
			VerdierResolution,
			VerdierResolutionPayload
		>,
	) {}

	isApplicableToGameContext(context: UnknownGameContext): boolean {
		return context.event === GameContextEvent.VERDIER;
	}

	async applyRule(context: GameContextWrapper): Promise<RuleEffects> {
		const { runner, player, diceValues } = context.asVerdier();

		const { bettingPlayers, lastDieValue } = await this.resolver.getResolution({
			player,
			diceValues,
		});

		const diceRoll: DiceRoll = [...diceValues, lastDieValue];

		const diceRollRuleEffects = await runner.handleGameEvent({
			event: GameContextEvent.DICE_ROLL,
			diceRoll,
			runner,
			player,
		});

		const isVerdierWon = isVelute(diceRoll);

		return [
			...diceRollRuleEffects,
			...bettingPlayers.map<RuleEffect>((bettingPlayer) => {
				if (isVerdierWon) {
					return {
						event: RuleEffectEvent.VERDIER_WON,
						value: 25,
						player: bettingPlayer,
					};
				}

				return {
					event: RuleEffectEvent.VERDIER_LOST,
					value: -5,
					player: bettingPlayer,
				};
			}),
		];
	}
}

//TODO: create type for DiceForm
export function isVerdierApplicable(diceForm: DiceForm): boolean {
	const invalidValues = diceForm.filter((dieValue) => {
		return dieValue === 1 || dieValue === 3 || dieValue === 5;
	});

	if (invalidValues.length > 0) {
		return false;
	}

	const [d1, d2, d3] = diceForm;

	return d1 !== d2 && d1 !== d3 && d2 !== d3;
}
