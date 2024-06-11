import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { GameContextEvent } from "../../game-context-event";
import type { DiceRollGameContext } from "../../game-context.ts";
import type { RuleRunner } from "../../rule-runner";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import { type SouffletteResolution, SouffletteRule } from "./soufflette-rule";

describe("isApplicableToGameContext", () => {
	it("returns true if dice make a 4, 2, 1 combination", () => {
		const rule = new SouffletteRule({ getResolution: vi.fn() });

		const context = DummyContextBuilder.aDiceRollContext()
			.withDiceRoll([4, 2, 1])
			.build()
			.asDiceRoll();

		expect(rule.isApplicableToGameContext(context)).toBe(true);
	});
});

describe("applyRule", () => {
	it("registers a no soufflette challenge in case the current player doesn't challenge someone", async () => {
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValue({ isChallenge: false } as SouffletteResolution),
		};

		const rule = new SouffletteRule(resolver);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([4, 2, 1])
			.build();

		expect(await rule.applyRule(context)).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE,
			player: "Alban",
			value: 0,
		});
	});

	it.each([
		[1, 50, -50],
		[2, 40, -40],
		[3, 30, -30],
	])(
		"registers a soufflette challenge won in %i rolls by the challenged player. Adds %i to the winner and %i points to the looser",
		async (numberOfDiceRolls, winnerScore, looserScore) => {
			const resolver = {
				getResolution: vi.fn().mockResolvedValue({
					isChallenge: true,
					challengedPlayer: "Delphin",
					numberOfDiceRolls,
					diceRoll: [2, 4, 1],
				} as SouffletteResolution),
			};

			const rule = new SouffletteRule(resolver);

			const context = DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([4, 2, 1])
				.build();

			const ruleEffects = await rule.applyRule(context);

			expect(ruleEffects).toContainEqual<RuleEffect>({
				event: RuleEffectEvent.SOUFFLETTE_WON,
				player: "Delphin",
				value: winnerScore,
			});

			expect(ruleEffects).toContainEqual<RuleEffect>({
				event: RuleEffectEvent.SOUFFLETTE_LOST,
				player: "Alban",
				value: looserScore,
			});
		},
	);

	it("registers a soufflette challenge won by the current player, without taking account of the number of rolls", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				isChallenge: true,
				challengedPlayer: "Delphin",
				numberOfDiceRolls: 1,
				diceRoll: [5, 4, 2],
			} as SouffletteResolution),
		};

		const rule = new SouffletteRule(resolver);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([4, 2, 1])
			.build();

		const ruleEffects = await rule.applyRule(context);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SOUFFLETTE_WON,
			player: "Alban",
			value: 30,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SOUFFLETTE_LOST,
			player: "Delphin",
			value: -30,
		});
	});

	it("registers a soufflette challenge won by the current player, where the challenged one rolled a neant", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				isChallenge: true,
				challengedPlayer: "Delphin",
				numberOfDiceRolls: 3,
				diceRoll: [1, 3, 6],
			} as SouffletteResolution),
		};

		const aRuleEffect: RuleEffect = {
			event: RuleEffectEvent.NEANT,
			player: "Delphin",
			value: 0,
		};

		const rule = new SouffletteRule(resolver);
		const runnerMock = {} as RuleRunner;
		runnerMock.handleGameEvent = vi.fn().mockResolvedValue([aRuleEffect]);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([4, 2, 1])
			.withRuleRunner(runnerMock)
			.build();

		const ruleEffects = await rule.applyRule(context);

		const expectedContext: DiceRollGameContext = {
			event: GameContextEvent.DICE_ROLL,
			player: "Delphin",
			diceRoll: [1, 3, 6],
			runner: runnerMock,
		};
		expect(runnerMock.handleGameEvent).toHaveBeenCalledWith(expectedContext);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SOUFFLETTE_WON,
			player: "Alban",
			value: 30,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SOUFFLETTE_LOST,
			player: "Delphin",
			value: -30,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>(aRuleEffect);
	});
});
