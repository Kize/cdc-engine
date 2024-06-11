import type {
	RobobrolResolution,
	RobobrolResolutionPayload,
} from "../../../../lib/rule-runner/rules/level-5/tichette-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class RobobrolRuleResolver extends RuleResolver<
	RobobrolResolution,
	RobobrolResolutionPayload
> {
	initResolution({ player }: RobobrolResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setRobobrol({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setRobobrol({
				active: false,
				player: "",
			}),
		);
	}
}

export const robobrolRuleResolver = new RobobrolRuleResolver();
