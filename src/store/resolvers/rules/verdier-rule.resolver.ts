import { RuleResolver } from '../../../../lib/rule-runner/rules/rule-resolver.ts';
import { store } from '../../store.ts';
import { resolversSlice } from '../resolvers.slice.ts';
import {
  VerdierResolution,
  VerdierResolutionPayload,
} from '../../../../lib/rule-runner/rules/level-3/verdier-rule.ts';

class VerdierRuleResolver extends RuleResolver<
  VerdierResolution,
  VerdierResolutionPayload
> {
  initResolution({ player, diceValues }: VerdierResolutionPayload): void {
    store.dispatch(
      resolversSlice.actions.setVerdier({
        active: true,
        player,
        diceValues,
      }),
    );
  }

  endResolution(): void {
    store.dispatch(
      resolversSlice.actions.setVerdier({
        active: false,
        player: '',
        diceValues: [1, 1],
      }),
    );
  }
}

export const verdierRuleResolver = new VerdierRuleResolver();
