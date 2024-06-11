import type { GameContextEvent } from "./game-context-event.ts";
import type { RuleRunner } from "./rule-runner.ts";
import type { DiceRoll, DieValue } from "./rules/dice-rule.ts";

export interface ApplyBevueGameContext {
	event: GameContextEvent.APPLY_BEVUE;
	playerWhoMadeABevue: string;
}

export interface ChallengeGrelottineGameContext {
	event: GameContextEvent.CHALLENGE_GRELOTTINE;
	runner: RuleRunner;
}

export interface DiceRollGameContext {
	event: GameContextEvent.DICE_ROLL;
	player: string;
	diceRoll: DiceRoll;
	runner: RuleRunner;
}

export interface CivetGameContext {
	event: GameContextEvent.CIVET_BET;
	runner: RuleRunner;
	player: string;
}

export interface VerdierGameContext {
	event: GameContextEvent.VERDIER;
	runner: RuleRunner;
	player: string;
	diceValues: [DieValue, DieValue];
}

export type PlayATurnGameContext =
	| DiceRollGameContext
	| CivetGameContext
	| VerdierGameContext;

export type UnknownGameContext =
	| DiceRollGameContext
	| ChallengeGrelottineGameContext
	| ApplyBevueGameContext
	| CivetGameContext
	| VerdierGameContext;
