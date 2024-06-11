import { describe, expect, it, vi } from "vitest";
import { DummyContextBuilder } from "../../../tests/dummy-game-context-builder";
import { RuleRunner } from "../../rule-runner.ts";
import {
	type CulDeChouetteResolution,
	CulDeChouetteRule,
} from "../basic-rules/cul-de-chouette-rule.ts";
import { type RuleEffect, RuleEffectEvent } from "../rule-effect";
import type { RuleResolver } from "../rule-resolver";
import {
	type AttrapeOiseauResolution,
	AttrapeOiseauRule,
} from "./attrape-oiseau-rule";
import type { SiropResolutionPayload } from "./sirotage-rule";
import { testSirotageRule } from "./sirotage-rule.spec";
import { BidType, type SiropBid } from "./sirotage-rule.types";

describe("It has the sirotage behaviour if there is no attrape oiseau", () => {
	testSirotageRule((resolution) => {
		const resolver = <
			RuleResolver<AttrapeOiseauResolution, SiropResolutionPayload>
		>{};
		resolver.getResolution = vi.fn().mockResolvedValue({
			...resolution,
			playerWhoMakeAttrapeOiseau: undefined,
		});
		return new AttrapeOiseauRule(resolver);
	});
});

describe("applyRule", () => {
	it("applies the sirotage to the player who stole the sirop if attrape oiseau is lost", async () => {
		const resolution: AttrapeOiseauResolution = {
			isSirote: true,
			bids: [],
			lastDieValue: 4,
			playerWhoMakeAttrapeOiseau: "Delphin",
		};
		const resolver = {
			getResolution: vi.fn().mockResolvedValue(resolution),
		};
		const rule = new AttrapeOiseauRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([3, 3, 4])
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ATTRAPE_OISEAU_LOST,
			player: "Delphin",
			value: -9,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CHOUETTE,
			player: "Alban",
			value: 9,
		});
	});

	it("applies the sirotage to the player who stole the sirop if attrape oiseau is won", async () => {
		const resolution: AttrapeOiseauResolution = {
			isSirote: true,
			bids: [],
			lastDieValue: 3,
			playerWhoMakeAttrapeOiseau: "Delphin",
		};
		const resolver = {
			getResolution: vi.fn().mockResolvedValue(resolution),
		};
		const rule = new AttrapeOiseauRule(resolver);

		const ruleEffects = await rule.applyRule(
			DummyContextBuilder.aDiceRollContext()
				.withPlayer("Alban")
				.withDiceRoll([3, 3, 4])
				.withRuleRunner(
					new RuleRunner([
						new CulDeChouetteRule({
							getResolution: vi.fn().mockResolvedValue({
								claimingPlayer: "Delphin",
							} as CulDeChouetteResolution),
						}),
					]),
				)
				.build(),
		);

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.ATTRAPE_OISEAU_WON,
			player: "Delphin",
			value: 70,
		});

		expect(ruleEffects).toContainEqual<RuleEffect>({
			event: RuleEffectEvent.CHOUETTE,
			player: "Alban",
			value: 9,
		});
	});

	it("handle the fil sirop bet", async () => {
		const bids: Array<SiropBid> = [
			{
				player: "Alban",
				playerBid: BidType.FILE_SIROP,
				isBidValidated: false,
			},
		];

		const resolver = {
			getResolution: vi.fn().mockResolvedValue({
				isSirote: true,
				lastDieValue: 6,
				bids,
			}),
		};
		const attrapeOiseauRule = new AttrapeOiseauRule(resolver);

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([2, 3, 2])
			.build();

		const ruleEffects = await attrapeOiseauRule.applyRule(gameContext);

		expect(ruleEffects).toContainEqual({
			event: RuleEffectEvent.SIROP_BET_WON,
			player: "Alban",
			value: 0,
		});
	});
});

describe("applyRule - ResolutionPayload", () => {
	it("gives the playable bids to the resolver", async () => {
		const resolver = {
			getResolution: vi.fn().mockResolvedValue({}),
		};
		const attrapeOiseauRule = new AttrapeOiseauRule(resolver);

		const gameContext = DummyContextBuilder.aDiceRollContext()
			.withPlayer("Alban")
			.withDiceRoll([3, 3, 5])
			.build();

		await attrapeOiseauRule.applyRule(gameContext);
		expect(resolver.getResolution).toHaveBeenCalledWith<
			[SiropResolutionPayload]
		>({
			player: "Alban",
			playableBids: [
				{ type: BidType.BEAU_SIROP, isPlayable: true },
				{ type: BidType.COUCHE_SIROP, isPlayable: true },
				{ type: BidType.FILE_SIROP, isPlayable: true },
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
