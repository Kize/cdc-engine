import { RuleResolver } from '../../../../lib/rule-runner/rules/rule-resolver.ts';
import { store } from '../../store.ts';
import { resolversSlice } from '../resolvers.slice.ts';
import {
  SiropResolutionPayload,
  SirotageResolution,
} from '../../../../lib/rule-runner/rules/level-1/sirotage-rule.ts';

class SiropRuleResolver extends RuleResolver<
  SirotageResolution,
  SiropResolutionPayload
> {
  initResolution({
    player,
    chouetteValue,
    playableBids,
  }: SiropResolutionPayload): void {
    store.dispatch(
      resolversSlice.actions.setSirop({
        active: true,
        player,
        chouetteValue,
        playableBids,
      }),
    );
  }

  endResolution(): void {
    store.dispatch(
      resolversSlice.actions.setSirop({
        active: false,
        player: '',
        chouetteValue: 1,
        playableBids: [],
      }),
    );
  }
}

export const siropRuleResolver = new SiropRuleResolver();
