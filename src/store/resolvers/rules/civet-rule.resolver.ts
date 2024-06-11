import type {
	CivetResolution,
	CivetResolutionPayload,
} from "../../../../lib/rule-runner/rules/level-1/civet-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class CivetRuleResolver extends RuleResolver<
	CivetResolution,
	CivetResolutionPayload
> {
	initResolution({ player }: CivetResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setCivet({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setCivet({
				active: false,
				player: "",
			}),
		);
	}
}

export const civetRuleResolver = new CivetRuleResolver();
