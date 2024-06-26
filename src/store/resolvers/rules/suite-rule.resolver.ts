import type {
	SuiteResolution,
	SuiteResolutionPayload,
} from "../../../../lib/rule-runner/rules/basic-rules/suite-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class SuiteRuleResolver extends RuleResolver<
	SuiteResolution,
	SuiteResolutionPayload
> {
	initResolution({ player }: SuiteResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setSuite({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setSuite({ active: false, player: "" }),
		);
	}
}

export const suiteRuleResolver = new SuiteRuleResolver();
