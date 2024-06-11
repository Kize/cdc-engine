import type {
	ChouetteVeluteResolution,
	ChouetteVeluteResolutionPayload,
} from "../../../../lib/rule-runner/rules/basic-rules/chouette-velute-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class ChouetteVeluteRuleResolver extends RuleResolver<
	ChouetteVeluteResolution,
	ChouetteVeluteResolutionPayload
> {
	initResolution({ player }: ChouetteVeluteResolutionPayload): void {
		store.dispatch(
			resolversSlice.actions.setChouetteVelute({
				active: true,
				player,
			}),
		);
	}

	endResolution(): void {
		store.dispatch(
			resolversSlice.actions.setChouetteVelute({
				active: false,
				player: "",
			}),
		);
	}
}

export const chouetteVeluteResolver = new ChouetteVeluteRuleResolver();
