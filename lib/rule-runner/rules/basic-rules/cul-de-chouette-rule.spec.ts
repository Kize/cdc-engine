import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import {
	type RuleEffect,
	RuleEffectEvent,
	type RuleEffects,
} from "../rule-effect";
import { CulDeChouetteRule } from "./cul-de-chouette-rule";

describe("isApplicableToDiceRoll", () => {
	it("returns true if all dice have the same value", () => {
		const rule = new CulDeChouetteRule({ getResolution: vi.fn() });

		expect(rule.isApplicableToDiceRoll([1, 1, 1])).toBe(true);
	});

	it("returns false if at least two dice are different", () => {
		const rule = new CulDeChouetteRule({ getResolution: vi.fn() });

		expect(rule.isApplicableToDiceRoll([1, 2, 1])).toBe(false);
	});
});

describe("applyRule", () => {
	it("registers a change of score of 60 for a cul de chouette of 2 when the player has claimed it.", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({ claimingPlayer: "Alban" }),
		};

		const rule = new CulDeChouetteRule(resolver);

		const effects = await rule.applyRule(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([2, 2, 2])
				.build(),
		);

		expect(effects).toEqual<RuleEffects>([
			{
				event: RuleEffectEvent.CUL_DE_CHOUETTE,
				player: "Alban",
				value: 60,
			},
		]);
	});

	it("returns a rule effect of 36 for the current player, and 24 for the player who has firstly claimed the cul de chouette.", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({ claimingPlayer: "Delphin" }),
		};

		const rule = new CulDeChouetteRule(resolver);

		const effects = await rule.applyRule(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([2, 2, 2])
				.build(),
		);

		expect(effects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CUL_DE_CHOUETTE,
			player: "Alban",
			value: 36,
		});

		expect(effects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CUL_DE_CHOUETTE_STOLEN,
			player: "Delphin",
			value: 24,
		});
	});
});
