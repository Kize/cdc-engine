import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { RuleEffectEvent } from "../rule-effect";
import { PouletteRule } from "./poulette-rule";
import { GrelottineBet } from "../basic-rules/grelottine-rule";
import { NeantRule } from "../basic-rules/neant-rule";
import { ChouetteRule } from "../basic-rules/chouette-rule";

describe("PouletteRule", () => {
	it("is not applicable to non-grelottine context", () => {
		const resolver = { getResolution: vi.fn() };
		const rule = new PouletteRule(resolver as any);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aDiceRollContext().build().asDiceRoll(),
			),
		).toBe(false);
	});

	it("applies poulette effect when grelottine challenge is néant and two players say 'elle est où la poulette'", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 6, 5],
				gambledAmount: 10,
				poulettePlayers: [{ player: "Alban" }, { player: "Delphin" }],
			}),
		};

		const rule = new PouletteRule(resolver as any);
		const ruleRunner = new RuleRunner([new NeantRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE,
			player: "Alban",
			value: -10,
		});

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE,
			player: "Delphin",
			value: -10,
		});
	});

	it("applies poulette effect when grelottine challenge is néant and one player says 'elle est où la poulette'", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 6, 5],
				gambledAmount: 10,
				poulettePlayers: [{ player: "Alban" }],
			}),
		};

		const rule = new PouletteRule(resolver as any);
		const ruleRunner = new RuleRunner([new NeantRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE,
			player: "Alban",
			value: 10,
		});

		const delphinPouletteEffect = effects.find(
			(e) => e.event === RuleEffectEvent.POULETTE && e.player === "Delphin"
		);
		expect(delphinPouletteEffect).toBeUndefined();
	});

	it("does not apply poulette effect when grelottine challenge is not néant", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 3, 5],
				gambledAmount: 10,
				poulettePlayers: [{ player: "Alban" }, { player: "Delphin" }],
			}),
		};

		const rule = new PouletteRule(resolver as any);
		const ruleRunner = new RuleRunner([new ChouetteRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		const pouletteEffects = effects.filter((e) => e.event === RuleEffectEvent.POULETTE);
		expect(pouletteEffects).toHaveLength(0);
	});
});
