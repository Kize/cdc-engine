import { beforeEach, describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { VeluteRule } from "../basic-rules/velute-rule";
import {
	type BleuRougeResolution,
	type BleuRougeResolutionPayload,
	BleuRougeRule,
} from "../level-3/bleu-rouge-rule";
import {
	type VerdierResolution,
	type VerdierResolutionPayload,
	VerdierRule,
} from "../level-3/verdier-rule";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import type { Resolver, RuleResolver } from "../rule-resolver";
import {
	type AttrapeOiseauResolution,
	AttrapeOiseauRule,
} from "./attrape-oiseau-rule";
import {
	CivetBet,
	type CivetResolution,
	type CivetResolutionPayload,
	CivetRule,
} from "./civet-rule";
import type { SiropResolutionPayload } from "./sirotage-rule";

describe("isApplicableToGameContext", () => {
	let dummyResolver: Resolver<CivetResolution, CivetResolutionPayload>;
	beforeEach(() => {
		dummyResolver = {
			getResolution: vi.fn(),
		};
	});

	it("returns false when the given event is not a civet", () => {
		const rule = new CivetRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aDiceRollContext().build().asDiceRoll(),
			),
		).toBe(false);
	});

	it("returns true when the given event is a civet", () => {
		const rule = new CivetRule(dummyResolver);
		expect(
			rule.isApplicableToGameContext(
				DummyContextBuilder.aCivetContext().build().asCivet(),
			),
		).toBe(true);
	});
});

describe("applyRule", () => {
	testCivetRule((resolution) => {
		const resolver = <RuleResolver<CivetResolution, CivetResolutionPayload>>{};
		resolver.getResolution = vi.fn().mockResolvedValue(resolution);
		return new CivetRule(resolver);
	});
});

// biome-ignore lint/suspicious/noExportsInTest: <explanation>
export function testCivetRule(
	getCivetRuleForResolution: (resolution: CivetResolution) => CivetRule,
): void {
	it("removes the civet for the player", async () => {
		const resolution: CivetResolution = {
			isVerdier: false,
			betAmount: 1,
			playerBet: CivetBet.VELUTE,
			diceRoll: [3, 3, 3],
		};

		const rule = getCivetRuleForResolution(resolution);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext().withPlayer("Alban").build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.REMOVE_CIVET,
			player: "Alban",
			value: 0,
		});
	});

	it("handles a lost civet bet", async () => {
		const resolution: CivetResolution = {
			isVerdier: false,
			betAmount: 42,
			playerBet: CivetBet.VELUTE,
			diceRoll: [3, 3, 3],
		};

		const rule = getCivetRuleForResolution(resolution);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext().withPlayer("Alban").build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_LOST,
			player: "Alban",
			value: -42,
		});
	});

	it("handles a won civet bet", async () => {
		const resolution: CivetResolution = {
			isVerdier: false,
			betAmount: 102,
			playerBet: CivetBet.VELUTE,
			diceRoll: [2, 3, 5],
		};

		const rule = getCivetRuleForResolution(resolution);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext()
				.withPlayer("Alban")
				.withRuleRunner(new RuleRunner([new VeluteRule()]))
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_WON,
			player: "Alban",
			value: 102,
		});
	});

	it("applies the dice roll rule effects to the player", async () => {
		const resolution: CivetResolution = {
			isVerdier: false,
			betAmount: 102,
			playerBet: CivetBet.VELUTE,
			diceRoll: [2, 3, 5],
		};

		const rule = getCivetRuleForResolution(resolution);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext()
				.withPlayer("Alban")
				.withRuleRunner(new RuleRunner([new VeluteRule()]))
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VELUTE,
			player: "Alban",
			value: 50,
		});
	});

	it("handles a lost civet bet when betting on a velute, and resulting into a bleu-rouge with a velute", async () => {
		const bleuRougeResolver: Resolver<
			BleuRougeResolution,
			BleuRougeResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				diceRoll: [2, 3, 5],
				bids: [{ player: "Alban", bet: 10 }],
			} as BleuRougeResolution),
		};

		const resolution: CivetResolution = {
			isVerdier: false,
			betAmount: 102,
			playerBet: CivetBet.VELUTE,
			diceRoll: [3, 4, 3],
		};

		const rule = getCivetRuleForResolution(resolution);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext()
				.withPlayer("Alban")
				.withRuleRunner(
					new RuleRunner([
						new BleuRougeRule(bleuRougeResolver),
						new VeluteRule(),
					]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_LOST,
			player: "Alban",
			value: -102,
		});
	});

	it("handles a won civet bet when betting on a chouette, and resulting into an attrape-oiseau by someone else", async () => {
		const civetResolver: Resolver<CivetResolution, CivetResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				isVerdier: false,
				betAmount: 102,
				playerBet: CivetBet.CHOUETTE,
				diceRoll: [3, 5, 3],
			} as CivetResolution),
		};

		const attrapeOiseauResolver: Resolver<
			AttrapeOiseauResolution,
			SiropResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				isSirote: true,
				playerWhoMakeAttrapeOiseau: "Delphin",
				lastDieValue: 5,
				bids: [],
			} as AttrapeOiseauResolution),
		};

		const rule = new CivetRule(civetResolver);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext()
				.withPlayer("Alban")
				.withRuleRunner(
					new RuleRunner([new AttrapeOiseauRule(attrapeOiseauResolver)]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_WON,
			player: "Alban",
			value: 102,
		});
	});

	it("handles a verdier call during a civet bet, where the bet is lost", async () => {
		const civetResolver: Resolver<CivetResolution, CivetResolutionPayload> = {
			getResolution: vi.fn().mockResolvedValue({
				isVerdier: true,
				betAmount: 102,
				playerBet: CivetBet.CHOUETTE,
				diceValues: [2, 4],
			} as CivetResolution),
		};

		const verdierResolver: Resolver<
			VerdierResolution,
			VerdierResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				bettingPlayers: ["Alban"],
				lastDieValue: 6,
			} as VerdierResolution),
		};

		const rule = new CivetRule(civetResolver);
		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aCivetContext()
				.withPlayer("Alban")
				.withRuleRunner(
					new RuleRunner([new VerdierRule(verdierResolver), new VeluteRule()]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CIVET_LOST,
			player: "Alban",
			value: -102,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.VERDIER_WON,
			player: "Alban",
			value: 25,
		});
	});
}
