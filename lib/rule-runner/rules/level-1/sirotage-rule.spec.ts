import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner";
import { ChouetteRule } from "../basic-rules/chouette-rule";
import {
	type CulDeChouetteResolution,
	type CulDeChouetteResolutionPayload,
	CulDeChouetteRule,
} from "../basic-rules/cul-de-chouette-rule.ts";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import type { Resolver, RuleResolver } from "../rule-resolver";
import {
	type CivetResolution,
	type CivetResolutionPayload,
	CivetRule,
} from "./civet-rule";
import {
	type SiropResolutionPayload,
	type SirotageResolution,
	SirotageRule,
} from "./sirotage-rule";
import { BidType, type SiropBid } from "./sirotage-rule.types";

describe("applyRule", () => {
	testSirotageRule((resolution) => {
		const resolver = <
			RuleResolver<SirotageResolution, SiropResolutionPayload>
		>{};
		resolver.getResolution = vi.fn().mockResolvedValue(resolution);
		return new SirotageRule(resolver);
	});
});

describe("applyRule - ResolutionPayload", () => {
	it("gives the playable bids to the resolver", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({}),
		};
		const sirotageRule = new SirotageRule(resolver);

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 5])
			.build();

		await sirotageRule.applyRule(gameContext);
		expect(resolver.getResolution).toHaveBeenCalledWith<
			[SiropResolutionPayload]
		>({
			player: "Alban",
			playableBids: [
				{ type: BidType.BEAU_SIROP, isPlayable: true },
				{ type: BidType.COUCHE_SIROP, isPlayable: true },
				{ type: BidType.LINOTTE, isPlayable: true },
				{ type: BidType.ALOUETTE, isPlayable: true },
				{ type: BidType.FAUVETTE, isPlayable: false },
				{ type: BidType.MOUETTE, isPlayable: true },
				{ type: BidType.BERGERONNETTE, isPlayable: true },
				{ type: BidType.CHOUETTE, isPlayable: true },
			],
			chouetteValue: 3,
		});
	});
});

// biome-ignore lint/suspicious/noExportsInTest: <explanation>
export function testSirotageRule(
	getSirotageRuleForResolution: (
		resolution: SirotageResolution,
	) => SirotageRule,
): void {
	it("applies the chouette rule when there is no sirotage", async () => {
		const sirotageRule = getSirotageRuleForResolution({ isSirote: false });

		const chouetteRule = new ChouetteRule();

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([2, 3, 2])
			.build();

		expect(await sirotageRule.applyRule(gameContext)).toEqual(
			await chouetteRule.applyRule(gameContext),
		);
	});

	it("registers a negative change of score for the player when the sirotage is failed", async () => {
		const sirotageRule = getSirotageRuleForResolution({
			isSirote: true,
			lastDieValue: 4,
			bids: [],
		});
		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([2, 3, 2])
			.build();

		expect(
			await sirotageRule.applyRule(gameContext),
		).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_LOST,
			player: "Alban",
			value: -4,
		});
	});

	it("triggers the cul de chouette rule to validate the sirop won", async () => {
		const sirotageRule = getSirotageRuleForResolution({
			isSirote: true,
			lastDieValue: 2,
			bids: [],
		});

		const cdcResolver: Resolver<
			CulDeChouetteResolution,
			CulDeChouetteResolutionPayload
		> = {
			getResolution: vi.fn().mockResolvedValue({
				claimingPlayer: "Alban",
			} as CulDeChouetteResolution),
		};

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Delphin")
			.withDiceRoll([2, 3, 2])
			.withRuleRunner(new RuleRunner([new CulDeChouetteRule(cdcResolver)]))
			.build();

		await sirotageRule.applyRule(gameContext);

		expect(cdcResolver.getResolution).toHaveBeenCalledWith({
			player: "Delphin",
		});
	});

	it("registers a change of score for each player's bet", async () => {
		const bids: Array<SiropBid> = [
			{
				player: "Alban",
				playerBid: BidType.MOUETTE,
				isBidValidated: false,
			},
			{
				player: "DelphinWinner",
				playerBid: BidType.CHOUETTE,
				isBidValidated: true,
			},
			{
				player: "NathanTooSlowToWin",
				playerBid: BidType.CHOUETTE,
				isBidValidated: false,
			},
			{
				player: "JulesNotBetting",
				playerBid: BidType.COUCHE_SIROP,
				isBidValidated: false,
			},
		];

		const sirotageRule = getSirotageRuleForResolution({
			isSirote: true,
			lastDieValue: 6,
			bids,
		});

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([2, 3, 2])
			.build();

		const ruleEffects = await sirotageRule.applyRule(gameContext);
		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_LOST,
			player: "Alban",
			value: -5,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_WON,
			player: "DelphinWinner",
			value: 25,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED,
			player: "NathanTooSlowToWin",
			value: 0,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_SKIPPED,
			player: "JulesNotBetting",
			value: 0,
		});
	});

	it("registers a change of score for each player's bet on a beau sirop", async () => {
		const bids: Array<SiropBid> = [
			{
				player: "Alban",
				playerBid: BidType.BEAU_SIROP,
				isBidValidated: true,
			},
			{
				player: "DelphinTooSlow",
				playerBid: BidType.BEAU_SIROP,
				isBidValidated: false,
			},
		];

		const sirotageRule = getSirotageRuleForResolution({
			isSirote: true,
			lastDieValue: 3,
			bids,
		});

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 5])
			.withRuleRunner(
				new RuleRunner([
					new CulDeChouetteRule({
						getResolution: vi
							.fn()
							.mockResolvedValue({ claimingPlayer: "Alban" }),
					}),
				]),
			)
			.build();

		const ruleEffects = await sirotageRule.applyRule(gameContext);
		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_WON,
			player: "Alban",
			value: 25,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED,
			player: "DelphinTooSlow",
			value: 0,
		});
	});

	it("adds a civet to the player when a sirop of 6 is lost", async () => {
		const sirotageRule = getSirotageRuleForResolution({
			isSirote: true,
			lastDieValue: 3,
			bids: [],
		});

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([6, 6, 5])
			.withRuleRunner(
				new RuleRunner([
					new CivetRule(
						{} as Resolver<CivetResolution, CivetResolutionPayload>,
					),
				]),
			)
			.build();

		const ruleEffects = await sirotageRule.applyRule(gameContext);
		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ADD_CIVET,
			player: "Alban",
			value: 0,
		});
	});
}
