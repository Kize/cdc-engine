import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../tests/dummy-game-context-builder";
import { RuleRunner } from "./rule-runner";
import { ChouetteRule } from "./rules/basic-rules/chouette-rule";
import type { DiceRoll } from "./rules/dice-rule";
import { type Rule, Rules } from "./rules/rule";
import type { RuleEffects } from "./rules/rule-effect";

describe("handleDiceRoll", () => {
	it("applies the correct rule", async () => {
		const invalidRule: Rule = {
			name: Rules.NEANT,
			isApplicableToGameContext: vi.fn().mockReturnValue(false),
			applyRule: vi.fn(),
		};

		const expectedRuleEffects: RuleEffects = [];

		const validRule: Rule = {
			name: Rules.NEANT,
			isApplicableToGameContext: vi.fn().mockReturnValue(true),
			applyRule: vi.fn().mockReturnValue(expectedRuleEffects),
		};

		const runner = new RuleRunner([invalidRule, validRule]);

		const diceRoll: DiceRoll = [1, 5, 6];
		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withDiceRoll(diceRoll)
			.build();
		const result = await runner.handleGameEvent(gameContext.asDiceRoll());

		expect(invalidRule.isApplicableToGameContext).toHaveBeenCalledWith(
			gameContext.asDiceRoll(),
		);
		expect(validRule.isApplicableToGameContext).toHaveBeenCalledWith(
			gameContext.asDiceRoll(),
		);

		expect(invalidRule.applyRule).not.toHaveBeenCalled();

		expect(validRule.applyRule).toHaveBeenCalledWith(gameContext);

		expect(result).toEqual(expectedRuleEffects);
	});
});

describe("getFirstApplicableRule", () => {
	it("throws an error when no rules are applicable", () => {
		const runner = new RuleRunner([new ChouetteRule()]);

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withDiceRoll([1, 3, 6])
			.build()
			.asDiceRoll();

		const wrapper = () => {
			runner.getFirstApplicableRule(gameContext, {});
		};

		expect(wrapper).toThrow();
	});

	it("returns a chouetteRule when the dice roll is a chouette", () => {
		const runner = new RuleRunner([new ChouetteRule()]);

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withDiceRoll([1, 3, 3])
			.build()
			.asDiceRoll();

		const rule = runner.getFirstApplicableRule(gameContext, {});

		expect(rule).toBeInstanceOf(ChouetteRule);
	});
});

describe("isRuleEnabled", () => {
	it("returns false when the rule is not enabled", () => {
		const runner = new RuleRunner([]);

		expect(runner.isRuleEnabled(Rules.CHOUETTE)).toBe(false);
	});

	it("returns true when the rule is enabled", () => {
		const runner = new RuleRunner([new ChouetteRule()]);

		expect(runner.isRuleEnabled(Rules.CHOUETTE)).toBe(true);
	});
});
