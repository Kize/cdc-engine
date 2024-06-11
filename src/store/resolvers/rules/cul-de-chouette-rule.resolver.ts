import type {
	CulDeChouetteResolution,
	CulDeChouetteResolutionPayload,
} from "../../../../lib/rule-runner/rules/basic-rules/cul-de-chouette-rule.ts";
import type { SuiteResolutionPayload } from "../../../../lib/rule-runner/rules/basic-rules/suite-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class CulDeChouetteRuleResolver extends RuleResolver<
	CulDeChouetteResolution,
	CulDeChouetteResolutionPayload
> {
	initResolution({ player }: SuiteResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setCulDeChouette({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setCulDeChouette({ active: false, player: "" }),
		);
	}
}

export const culDeChouetteRuleResolver = new CulDeChouetteRuleResolver();
