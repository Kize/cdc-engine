import type {
	SouffletteResolution,
	SouffletteResolutionPayload,
} from "../../../../lib/rule-runner/rules/level-1/soufflette-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class SouffletteRuleResolver extends RuleResolver<
	SouffletteResolution,
	SouffletteResolutionPayload
> {
	initResolution({ player }: SouffletteResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setSoufflette({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setSoufflette({
				active: false,
				player: "",
			}),
		);
	}
}

export const souffletteRuleResolver = new SouffletteRuleResolver();
