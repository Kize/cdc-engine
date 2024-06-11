import {
	GameContextEvent,
	type GameContextWrapper,
} from "../game-context-event";
import type {
	DiceRollGameContext,
	UnknownGameContext,
} from "../game-context.ts";
import type { Rule, Rules } from "./rule";
import type { RuleEffects } from "./rule-effect";

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [DieValue, DieValue, DieValue];

export abstract class DiceRule implements Rule {
	abstract name: Rules;

	abstract isApplicableToDiceRoll(diceRoll: DiceRoll): boolean;

	abstract applyDiceRule(
		context: DiceRollGameContext,
	): RuleEffects | Promise<RuleEffects>;

	isApplicableToGameContext(gameContext: UnknownGameContext): boolean {
		if (gameContext.event === GameContextEvent.DICE_ROLL) {
			return this.isApplicableToDiceRoll(gameContext.diceRoll);
		}

		return false;
	}

	applyRule(
		gameContextWrapper: GameContextWrapper,
	): RuleEffects | Promise<RuleEffects> {
		return this.applyDiceRule(gameContextWrapper.asDiceRoll());
	}
}
