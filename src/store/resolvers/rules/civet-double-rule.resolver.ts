import { RuleResolver } from '../../../../lib/rule-runner/rules/rule-resolver.ts';
import { store } from '../../store.ts';
import { resolversSlice } from '../resolvers.slice.ts';
import { CivetResolutionPayload } from '../../../../lib/rule-runner/rules/level-1/civet-rule.ts';
import { CivetDoubledResolution } from '../../../../lib/rule-runner/rules/level-2/civet-doubled-rule.ts';

class CivetDoubleRuleResolver extends RuleResolver<
  CivetDoubledResolution,
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
        player: '',
      }),
    );
  }
}

export const civetDoubleRuleResolver = new CivetDoubleRuleResolver();
