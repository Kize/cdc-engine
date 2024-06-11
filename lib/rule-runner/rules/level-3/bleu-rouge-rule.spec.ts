import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { NeantRule } from "../basic-rules/neant-rule";
import { VeluteRule } from "../basic-rules/velute-rule.ts";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import { type BleuRougeResolution, BleuRougeRule } from "./bleu-rouge-rule";

describe("isApplicableToGameContext", () => {
	it("returns true if dice make a 4, 3, 3 combination", () => {
		const rule = new BleuRougeRule({ getResolution: vi.fn() });

		const context = DummyContextBuilder.aDiceRollContext()
			.withDiceRoll([3, 4, 3])
			.build()
			.asDiceRoll();

		expect(rule.isApplicableToGameContext(context)).toBe(true);
	});
});

describe("applyRule", () => {
	it("registers the initial chouette for the current player as a Bleu-Rouge", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				bids: [],
				diceRoll: [1, 5, 6],
			} as BleuRougeResolution),
		};

		const rule = new BleuRougeRule(resolver);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 4])
			.build();

		expect(await rule.applyRule(context)).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.BLEU_ROUGE,
			player: "Alban",
			value: 9,
		});
	});

	it("registers a bleu-rouge bet won by the current player", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				diceRoll: [2, 2, 2],
				bids: [
					{ player: "Delphin", bet: 5 },
					{ player: "Alban", bet: 6 },
				],
			} as BleuRougeResolution),
		};

		const rule = new BleuRougeRule(resolver);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 4])
			.build();

		const ruleEffects = await rule.applyRule(context);

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
			player: "Delphin",
			value: 46,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.BLEU_ROUGE_BET_WON,
			player: "Alban",
			value: 48,
		});
	});

	it("registers a bleu-rouge bet won by the current player with the last dice combination rule effects", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				diceRoll: [1, 5, 6],
				bids: [{ player: "Alban", bet: 12 }],
			} as BleuRougeResolution),
		};

		const aRuleEffect: RuleEffect = {
			event: RuleEffectEvent.VELUTE,
			player: "Alban",
			value: 72,
		};

		const rule = new BleuRougeRule(resolver);
		const runnerMock = {} as RuleRunner;
		runnerMock.handleGameEvent = vi.fn().mockResolvedValue([aRuleEffect]);
		runnerMock.getFirstApplicableRule = vi
			.fn()
			.mockResolvedValue(new VeluteRule());

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 4])
			.withRuleRunner(runnerMock)
			.build();

		const ruleEffects = await rule.applyRule(context);

		expect(ruleEffects).toContainEqual<RuleEffect>(aRuleEffect);
	});

	it("registers an add jarret effect for the current player if the combination is a Neant, without adding a grelottine, when the last bet is not won by someone", async () => {
		/* Case scenario:
		 *  Alban rolls a Bleu-Rouge
		 *  Delphin bets 10 | Alban bets whatever false...
		 *  Alban rolls another Bleu-Rouge
		 *  Delphin wins the bet, the second Bleu-rouge is applied to Delphin
		 *  Alban & Delphin bet whatever false
		 *  Delphin rolls a Neant, nobody wins the bet
		 *  Delphin wins a Jarret, Alban doesn't
		 * */
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValueOnce({
					diceRoll: [3, 3, 4],
					bids: [
						{ player: "Delphin", bet: 10 },
						{ player: "Alban", bet: 6 },
					],
				})
				.mockResolvedValueOnce({
					diceRoll: [1, 3, 5],
					bids: [
						{ player: "Delphin", bet: 3 },
						{ player: "Alban", bet: 4 },
					],
				}),
		};

		const rule = new BleuRougeRule(resolver);
		const runner = new RuleRunner([
			new BleuRougeRule(resolver),
			new NeantRule(),
		]);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 4])
			.withRuleRunner(runner)
			.build();

		const ruleEffects = await rule.applyRule(context);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.BLEU_ROUGE,
			player: "Delphin",
			value: 9,
		});

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_GRELOTTINE,
			player: "Delphin",
			value: 0,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_JARRET,
			player: "Delphin",
			value: 0,
		});

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_JARRET,
			player: "Alban",
			value: 0,
		});
	});

	it("registers an add jarret effect for the current player if the combination is a Neant, without adding a grelottine, when the last bet is won by the first current player", async () => {
		/* Case scenario:
		 *  Alban rolls a Bleu-Rouge
		 *  Delphin bets 10 | Alban bets whatever false...
		 *  Alban rolls another Bleu-Rouge
		 *  Delphin wins the bet, the second Bleu-rouge is applied to Delphin
		 *  Alban bets 11 | Delphin bets whatever false
		 *  Delphin rolls a Neant, Alban wins the bet
		 *  Delphin wins a Jarret, Alban doesn't
		 * */
		const resolver = {
			getResolution: vi
				.fn()
				.mockResolvedValueOnce({
					diceRoll: [3, 3, 4],
					bids: [
						{ player: "Delphin", bet: 10 },
						{ player: "Alban", bet: 6 },
					],
				})
				.mockResolvedValueOnce({
					diceRoll: [6, 4, 1],
					bids: [
						{ player: "Delphin", bet: 3 },
						{ player: "Alban", bet: 11 },
					],
				}),
		};

		const rule = new BleuRougeRule(resolver);
		const runner = new RuleRunner([
			new BleuRougeRule(resolver),
			new NeantRule(),
		]);

		const context = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 4])
			.withRuleRunner(runner)
			.build();

		const ruleEffects = await rule.applyRule(context);

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_GRELOTTINE,
			player: "Delphin",
			value: 0,
		});

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_GRELOTTINE,
			player: "Alban",
			value: 0,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_JARRET,
			player: "Delphin",
			value: 0,
		});

		expect(ruleEffects).not.toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_JARRET,
			player: "Alban",
			value: 0,
		});
	});
});
