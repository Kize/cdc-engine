import { describe, expect, it } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import { NeantRule } from "./neant-rule";

describe("isApplicableToDiceRoll", () => {
	it("returns always true", () => {
		const rule = new NeantRule();

		expect(rule.isApplicableToDiceRoll()).toBe(true);
	});
});

describe("applyRule", () => {
	it("applies a grelottine to the current player", () => {
		const effects = new NeantRule().applyRule(
			DummyContextBuilder.aDiceRollContext().withPlayer("Alban").build(),
		);

		expect(effects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_GRELOTTINE,
			player: "Alban",
			value: 0,
		});
	});

	it("registers a change of score the the current player", () => {
		const effects = new NeantRule().applyRule(
			DummyContextBuilder.aDiceRollContext().withPlayer("Alban").build(),
		);

		expect(effects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.NEANT,
			player: "Alban",
			value: 0,
		});
	});
});
