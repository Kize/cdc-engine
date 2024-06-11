import { beforeEach, describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { RuleEffectEvent, type RuleEffects } from "../rule-effect";
import { SuiteRule } from "./suite-rule";
import { VeluteRule } from "./velute-rule";

describe("isApplicableToDiceRoll", () => {
	let rule: SuiteRule;

	beforeEach(() => {
		rule = new SuiteRule({ getResolution: vi.fn() });
	});

	it("returns true if dice follows each others", () => {
		expect(rule.isApplicableToDiceRoll([1, 3, 2])).toBe(true);
	});

	it("returns false dice don't follow each other", () => {
		expect(rule.isApplicableToDiceRoll([1, 3, 6])).toBe(false);
	});
});

describe("applyRule", () => {
	it("registers a change of score of -10 for a given player", async () => {
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValue({ losingPlayer: "Alban", multiplier: 1 }),
		};

		const rule = new SuiteRule(resolver);

		expect(
			await rule.applyRule(DummyContextBuilder.aDiceRollContext().build()),
		).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.SUITE,
				player: "Alban",
				value: -10,
			},
		]);
	});

	it("registers a change of score of -40 for a given player and a multiplier of 4", async () => {
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValue({ losingPlayer: "Delphin", multiplier: 4 }),
		};

		const rule = new SuiteRule(resolver);

		expect(
			await rule.applyRule(DummyContextBuilder.aDiceRollContext().build()),
		).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.SUITE,
				player: "Delphin",
				value: -40,
			},
		]);
	});

	it("registers a change of score of -10 for a given player, and applies the velute for the currentPlayer on 1,2,3", async () => {
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValue({ losingPlayer: "Delphin", multiplier: 1 }),
		};

		const rule = new SuiteRule(resolver);

		expect(
			await rule.applyRule(
				DummyContextBuilder.aDiceRollContext()
					.withDiceRoll([1, 2, 3])
					.withPlayer("Alban")
					.withRuleRunner(new RuleRunner([new VeluteRule()]))
					.build(),
			),
		).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.SUITE_VELUTE,
				player: "Alban",
				value: 18,
			},
			{
				event: RuleEffectEvent.SUITE,
				player: "Delphin",
				value: -10,
			},
		]);
	});
});
