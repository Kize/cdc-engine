import { beforeEach, describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import {
	type VerdierResolution,
	type VerdierResolutionPayload,
	VerdierRule,
	isVerdierValid,
} from "./verdier-rule";

describe("isApplicableToGameContext", () => {
	let dummyResolver: Resolver<VerdierResolution, VerdierResolutionPayload>;
	beforeEach(() => {
		dummyResolver = {
			getResolution: vi.fn(),
		};
	});

	it("returns false when the given event is not a verdier", () => {
		const rule = new VerdierRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aDiceRollContext().build().asDiceRoll(),
			),
		).toBe(false);
	});

	it("returns true when the given event is a verdier", () => {
		const rule = new VerdierRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aVerdierContext().build().asVerdier(),
			),
		).toBe(true);
	});
});

describe("applyRule", () => {
	it("applies the dice roll rule effects to the player", async () => {
		const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				bettingPlayers: [],
				lastDieValue: 4,
			} as VerdierResolution),
		};

		const rule = new VerdierRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aVerdierContext()
				.withPlayer("Alban")
				.withDiceValues([2, 4])
				.withRuleRunner(new RuleRunner([new ChouetteRule()]))
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CHOUETTE,
			player: "Alban",
			value: 16,
		});
	});

	it("handles bets for a won verdier", async () => {
		const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				bettingPlayers: ["Alban", "Delphin"],
				lastDieValue: 6,
			} as VerdierResolution),
		};

		const rule = new VerdierRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aVerdierContext()
				.withPlayer("Alban")
				.withDiceValues([2, 4])
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_WON,
			player: "Alban",
			value: 25,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_WON,
			player: "Delphin",
			value: 25,
		});
	});

	it("handles bets for a lost verdier", async () => {
		const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				bettingPlayers: ["Alban", "Delphin"],
				lastDieValue: 5,
			} as VerdierResolution),
		};

		const rule = new VerdierRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aVerdierContext()
				.withPlayer("Alban")
				.withDiceValues([2, 4])
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_LOST,
			player: "Alban",
			value: -5,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_LOST,
			player: "Delphin",
			value: -5,
		});
	});

	it("registers the verdier as lost when the end result is a chouette velute", async () => {
		const resolver: Resolver<VerdierResolution, VerdierResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				bettingPlayers: ["Alban", "Delphin"],
				lastDieValue: 2,
			} as VerdierResolution),
		};

		const rule = new VerdierRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aVerdierContext()
				.withPlayer("Alban")
				.withDiceValues([2, 4])
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_LOST,
			player: "Alban",
			value: -5,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_LOST,
			player: "Delphin",
			value: -5,
		});
	});
});

describe("isVerdierApplicable", () => {
	it("returns false when given 0-0-0", () => {
		const result = isVerdierValid([null, null, null]);

		expect(result).toBe(false);
	});

	it("returns false when given 0-0-5", () => {
		const result = isVerdierValid([null, null, 5]);

		expect(result).toBe(false);
	});

	it("returns true when given 4-0-2", () => {
		const result = isVerdierValid([4, null, 2]);

		expect(result).toBe(true);
	});

	it("returns false when given 2-2-0", () => {
		const result = isVerdierValid([null, 2, 2]);

		expect(result).toBe(false);
	});
});
