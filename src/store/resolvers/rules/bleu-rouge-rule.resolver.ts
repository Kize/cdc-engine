import type {
	BleuRougeResolution,
	BleuRougeResolutionPayload,
} from "../../../../lib/rule-runner/rules/level-3/bleu-rouge-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class BleuRougeRuleResolver extends RuleResolver<
	BleuRougeResolution,
	BleuRougeResolutionPayload
> {
	initResolution({ player }: BleuRougeResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setBleuRouge({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setBleuRouge({
				active: false,
				player: "",
			}),
		);
	}
}

export const bleuRougeRuleResolver = new BleuRougeRuleResolver();
