import type {
	ApplyBevueGameContext,
	ChallengeGrelottineGameContext,
	CivetGameContext,
	DiceRollGameContext,
	UnknownGameContext,
	VerdierGameContext,
} from "./game-context.ts";

export class GameContextWrapper {
	constructor(private gameContext: UnknownGameContext) {}

	asDiceRoll(): DiceRollGameContext {
		if (this.gameContext.event === GameContextEvent.DICE_ROLL) {
			return this.gameContext;
		}
		throw new Error("The given game context should be a PlayTurnGameContext");
	}

	asChallengeGrelottine(): ChallengeGrelottineGameContext {
		if (this.gameContext.event === GameContextEvent.CHALLENGE_GRELOTTINE) {
			return this.gameContext;
		}
		throw new Error(
			"The given game context should be a ChallengeGrelottineGameContext",
		);
	}

	asApplyBevue(): ApplyBevueGameContext {
		if (this.gameContext.event === GameContextEvent.APPLY_BEVUE) {
			return this.gameContext;
		}
		throw new Error(
			"The given game context should be an ApplyBevueGameContext",
		);
	}

	asCivet(): CivetGameContext {
		if (this.gameContext.event === GameContextEvent.CIVET_BET) {
			return this.gameContext;
		}
		throw new Error("The given game context should be a Civet");
	}

	asVerdier(): VerdierGameContext {
		if (this.gameContext.event === GameContextEvent.VERDIER) {
			return this.gameContext;
		}
		throw new Error("The given game context should be a Civet");
	}
}

export enum GameContextEvent {
	DICE_ROLL = 0,
	CHALLENGE_GRELOTTINE = 1,
	APPLY_BEVUE = 2,
	CIVET_BET = 3,
	VERDIER = 4,
}
