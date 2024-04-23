import { RuleResolver } from '../../../../lib/rule-runner/rules/rule-resolver.ts';
import { store } from '../../store.ts';
import { resolversSlice } from '../resolvers.slice.ts';
import {
  TichetteResolution,
  TichetteResolutionPayload,
} from '../../../../lib/rule-runner/rules/level-5/tichette-rule.ts';

class TichetteRuleResolver extends RuleResolver<
  TichetteResolution,
  TichetteResolutionPayload
> {
  initResolution({
    player,
    canClaimRobobrol,
  }: TichetteResolutionPayload): void {
    store.dispatch(
      resolversSlice.actions.setTichette({
        active: true,
        player,
        canClaimRobobrol,
      }),
    );
  }

  endResolution(): void {
    store.dispatch(
      resolversSlice.actions.setTichette({
        active: false,
        player: '',
        canClaimRobobrol: false,
      }),
    );
  }
}

export const tichetteRuleResolver = new TichetteRuleResolver();
