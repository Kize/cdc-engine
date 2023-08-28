import { RuleResolver } from '../../../../lib/rule-runner/rules/rule-resolver.ts';
import { store } from '../../store.ts';
import { resolversSlice } from '../resolvers.slice.ts';
import {
  ArtichetteResolution,
  ArtichetteResolutionPayload,
} from '../../../../lib/rule-runner/rules/level-2/artichette-rule.ts';

class ArtichetteRuleResolver extends RuleResolver<
  ArtichetteResolution,
  ArtichetteResolutionPayload
> {
  initResolution({ player }: ArtichetteResolutionPayload): void {
    store.dispatch(
      resolversSlice.actions.setArtichette({
        active: true,
        player,
      }),
    );
  }

  endResolution(): void {
    store.dispatch(
      resolversSlice.actions.setArtichette({
        active: false,
        player: '',
      }),
    );
  }
}

export const artichetteRuleResolver = new ArtichetteRuleResolver();
