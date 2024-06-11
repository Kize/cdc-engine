import { describe, expect, it } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import { ChouetteRule } from "./chouette-rule";

describe("isApplicableToDiceRoll", () => {
	it("returns true if two dice have the same value", () => {
		const rule = new ChouetteRule();

		expect(rule.isApplicableToDiceRoll([1, 1, 5])).toBe(true);
	});

	it("returns false if at least all dice are different", () => {
		const rule = new ChouetteRule();

		expect(rule.isApplicableToDiceRoll([1, 2, 3])).toBe(false);
	});
});

describe("applyRule", () => {
	it("registers a change of score of 25 for a chouette of 5", async () => {
		const effects = await new ChouetteRule().applyRule(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([5, 5, 2])
				.build(),
		);

		expect(effects).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.CHOUETTE,
				player: "Alban",
				value: 25,
			},
		]);
	});
});
