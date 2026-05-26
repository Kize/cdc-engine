import type {
    PouletteResolution,
    PouletteResolutionPayload,
} from "../../../../lib/rule-runner/rules/level-1/poulette-rule.ts";
import { RuleResolver } from "../../../../lib/rule-runner/rules/rule-resolver.ts";
import { store } from "../../store.ts";
import { resolversSlice } from "../resolvers.slice.ts";

class PouletteRuleResolver extends RuleResolver<
    PouletteResolution,
    PouletteResolutionPayload
> {
    initResolution(payload?: PouletteResolutionPayload): void {
        store.dispatch(
            resolversSlice.actions.setPoulette({
                active: true,
                players: payload?.grelottinePlayers ?? [],
            }),
        );
    }

    endResolution(): void {
        store.dispatch(
            resolversSlice.actions.setPoulette({
                active: false,
                players: [],
            }),
        );
    }
}

export const pouletteRuleResolver = new PouletteRuleResolver();
