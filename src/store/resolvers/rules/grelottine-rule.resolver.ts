import type { GrelottineResolution } from "../../../../lib/rule-runner/rules/basic-rules/grelottine-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class GrelottineRuleResolver extends RuleResolver<GrelottineResolution> {
	initResolution(): void {
		store.dispatch(resolversSlice.actions.setGrelottine({ active: true }));
	}

	endResolution(): void {
		store.dispatch(resolversSlice.actions.setGrelottine({ active: false }));
	}
}

export const grelottineResolver = new GrelottineRuleResolver();
