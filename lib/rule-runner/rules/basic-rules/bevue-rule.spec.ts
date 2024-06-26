import { describe, expect, it } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import { BevueRule } from "./bevue-rule";

describe("isApplicableToGameContext", () => {
	it("returns false if the game context is not a Bevue", () => {
		const rule = new BevueRule();
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aGrelottineContext()
					.build()
					.asChallengeGrelottine(),
			),
		).toBe(false);
	});

	it("returns true if the game context is a Bevue", () => {
		const rule = new BevueRule();
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aBevueContext().build().asApplyBevue(),
			),
		).toBe(true);
	});
});

describe("applyRule", () => {
	it("applies a bevue to the player who made a bevue", () => {
		const rule = new BevueRule();
		const ruleEffects = rule.applyRule(
			DummyContextBuilder.aBevueContext()
				.withPlayerWhoMadeABevue("Delphin")
				.build(),
		);

		expect(ruleEffects).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.BEVUE,
				player: "Delphin",
				value: -5,
			},
		]);
	});
});
