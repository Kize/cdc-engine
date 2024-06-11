import { beforeEach, describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import {
	type AttrapeOiseauResolution,
	AttrapeOiseauRule,
} from "../level-1/attrape-oiseau-rule";
import {
	CivetBet,
	type CivetResolution,
	type CivetResolutionPayload,
	CivetRule,
} from "../level-1/civet-rule";
import type { SiropResolutionPayload } from "../level-1/sirotage-rule";
import {
	type BleuRougeResolution,
	type BleuRougeResolutionPayload,
	BleuRougeRule,
} from "../level-3/bleu-rouge-rule";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import type { Resolver } from "../rule-resolver";
import { ChouetteRule } from "./chouette-rule";
import {
	GrelottineBet,
	type GrelottineResolution,
	GrelottineRule,
} from "./grelottine-rule";
import { VeluteRule } from "./velute-rule";

describe("isApplicableToGameContext", () => {
	let dummyResolver: Resolver<GrelottineResolution>;
	beforeEach(() => {
		dummyResolver = {
			getResolution: vi.fn(),
		};
	});

	it("returns false when the given event is not a grelottine", () => {
		const rule = new GrelottineRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aDiceRollContext().build().asDiceRoll(),
			),
		).toBe(false);
	});

	it("returns true when the given event is a grelottine", () => {
		const rule = new GrelottineRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aGrelottineContext()
					.build()
					.asChallengeGrelottine(),
			),
		).toBe(true);
	});
});

describe("applyRule", () => {
	it("handles a lost grelottine challenge", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [1, 6, 4],
				gambledAmount: 12,
			}),
		};

		const rule = new GrelottineRule(resolver);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext().build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
			player: "Alban",
			value: 12,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
			player: "Delphin",
			value: -12,
		});
	});

	it("removes the grelottine for the grelottin", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [1, 6, 4],
				gambledAmount: 12,
			}),
		};

		const rule = new GrelottineRule(resolver);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext().build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.REMOVE_GRELOTTINE,
			value: 0,
			player: "Alban",
		});
	});

	it("handles a won grelottine challenge", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [1, 1, 4],
				gambledAmount: 32,
			}),
		};

		const rule = new GrelottineRule(resolver);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(new RuleRunner([new ChouetteRule()]))
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
			player: "Alban",
			value: -32,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
			player: "Delphin",
			value: 32,
		});
	});

	it("applies the dice roll rule effects to the challenged player", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 3, 3],
				gambledAmount: 12,
			}),
		};

		const rule = new GrelottineRule(resolver);
		const ruleRunner = <RuleRunner>{};
		const aRuleEffect = {
			event: RuleEffectEvent.CUL_DE_CHOUETTE,
			player: "Delphin",
			value: 70,
		};
		ruleRunner.handleGameEvent = vi.fn().mockResolvedValue([aRuleEffect]);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(ruleRunner)
				.build(),
		);
		expect(ruleRunner.handleGameEvent).toHaveBeenCalledWith(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Delphin")
				.withDiceRoll([3, 3, 3])
				.withRuleRunner(ruleRunner)
				.build()
				.asDiceRoll(),
		);
		expect(ruleEffects).toContainEqual<RuleEffect>(aRuleEffect);
	});

	it("handles a won grelottine bet for the grelottin, betting on a velute, and resulting into a bleu-rouge with a velute", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.VELUTE,
				diceRoll: [3, 3, 4],
				gambledAmount: 12,
			} as GrelottineResolution),
		};

		const bleuRougeResolver: Resolver<
			BleuRougeResolution,
			BleuRougeResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				diceRoll: [2, 3, 5],
				bids: [{ player: "Alban", bet: 10 }],
			} as BleuRougeResolution),
		};

		const rule = new GrelottineRule(grelottineResolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(
					new RuleRunner([
						new BleuRougeRule(bleuRougeResolver),
						new VeluteRule(),
					]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
			player: "Alban",
			value: 12,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
			player: "Delphin",
			value: -12,
		});
	});

	it("handles a lost grelottine for the grelottin, betting on a chouette, and resulting into an attrape-oiseau", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.CHOUETTE,
				diceRoll: [3, 3, 5],
				gambledAmount: 12,
			} as GrelottineResolution),
		};
		const rule = new GrelottineRule(grelottineResolver);

		const attrapeOiseauResolver: Resolver<
			AttrapeOiseauResolution,
			SiropResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				bids: [],
				isSirote: true,
				playerWhoMakeAttrapeOiseau: "Alban",
				lastDieValue: 5,
			} as AttrapeOiseauResolution),
		};

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(
					new RuleRunner([
						new AttrapeOiseauRule(attrapeOiseauResolver),
						new ChouetteRule(),
					]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
			player: "Delphin",
			value: 12,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
			player: "Alban",
			value: -12,
		});
	});

	it("handles a civet bet during a grelottine challenge", async () => {
		const grelottineResolver: Resolver<GrelottineResolution> = {
			getResolution: vi.fn().mockResolvedValue({
				grelottinPlayer: "Alban",
				challengedPlayer: "Delphin",
				grelottinBet: GrelottineBet.VELUTE,
				gambledAmount: 12,
			} as GrelottineResolution),
		};

		const civetResolver: Resolver<CivetResolution, CivetResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				playerBet: CivetBet.VELUTE,
				betAmount: 42,
				diceRoll: [2, 3, 5],
			} as CivetResolution),
		};

		const rule = new GrelottineRule(grelottineResolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aGrelottineContext()
				.withRuleRunner(
					new RuleRunner([new CivetRule(civetResolver), new VeluteRule()]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_WON,
			player: "Delphin",
			value: 42,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
			player: "Delphin",
			value: 12,
		});
	});
});
