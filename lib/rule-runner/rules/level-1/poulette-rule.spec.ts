import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { RuleEffectEvent } from "../rule-effect";
import { type PouletteResolution, type PouletteResolutionPayload, PouletteRule } from "./poulette-rule";
import {
	GrelottineBet,
	type GrelottineResolution,
} from "../basic-rules/grelottine-rule";
import { NeantRule } from "../basic-rules/neant-rule";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import type { Resolver } from "../rule-resolver";

describe("PouletteRule", () => {
	it("applies poulette effect when grelottine challenge is néant and two players say 'elle est où la poulette'", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 6, 5],
				gambledAmount: 10,
			}),
		};
		const pouletteResolver: Resolver<PouletteResolution, PouletteResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				poulettePlayers: ["Alban", "Delphin"],
			}),
		};

		const rule = new PouletteRule(grelottineResolver, pouletteResolver);
		const ruleRunner = new RuleRunner([new NeantRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE_LOST,
			player: "Alban",
			value: -10,
		});

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE_LOST,
			player: "Delphin",
			value: -10,
		});
	});

	it("applies poulette effect when grelottine challenge is néant and one player says 'elle est où la poulette'", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 6, 5],
				gambledAmount: 10,
			}),
		};
		const pouletteResolver: Resolver<PouletteResolution, PouletteResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				poulettePlayers: ["Alban"],
			}),
		};

		const rule = new PouletteRule(grelottineResolver, pouletteResolver);
		const ruleRunner = new RuleRunner([new NeantRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		expect(effects).toContainEqual({
			event: RuleEffectEvent.POULETTE_WON,
			player: "Alban",
			value: 10,
		});

		const delphinPouletteEffect = effects.find(
			(e) => e.event === RuleEffectEvent.POULETTE_WON && e.player === "Delphin",
		);
		expect(delphinPouletteEffect).toBeUndefined();
	});

	it("does not apply poulette effect when grelottine challenge is not néant", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 3, 5],
				gambledAmount: 10,
			}),
		};
		const pouletteResolver: Resolver<PouletteResolution, PouletteResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				poulettePlayers: ["Alban", "Delphin"],
			}),
		};

		const rule = new PouletteRule(grelottineResolver, pouletteResolver);
		const ruleRunner = new RuleRunner([new ChouetteRule()]);
		const effects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);

		const pouletteEffects = effects.filter(
			(e) =>
				e.event === RuleEffectEvent.POULETTE_WON ||
				e.event === RuleEffectEvent.POULETTE_LOST,
		);
		expect(pouletteEffects).toHaveLength(0);
	});
});
