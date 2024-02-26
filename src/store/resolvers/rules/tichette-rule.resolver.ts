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
  initResolution({ player }: TichetteResolutionPayload): void {
    store.dispatch(
      resolversSlice.actions.setTichette({
        active: true,
        player,
      }),
    );
  }

  endResolution(): void {
    store.dispatch(
      resolversSlice.actions.setTichette({
        active: false,
        player: '',
      }),
    );
  }
}

export const tichetteRuleResolver = new TichetteRuleResolver();
