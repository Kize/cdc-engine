import { describe, expect, it } from 'vitest';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { DoubleBevueRule } from './double-bevue-rule.ts';

describe('applyRule', () => {
  it('applies a bevue for 10 points to the player who made a bevue', () => {
    const rule = new DoubleBevueRule();
    const ruleEffects = rule.applyRule(
      DummyContextBuilder.aBevueContext()
        .withPlayerWhoMadeABevue('Delphin')
        .build(),
    );

    expect(ruleEffects).toEqual<RuleEffects>([
      {
        event: RuleEffectEvent.BEVUE,
        player: 'Delphin',
        value: -10,
      },
    ]);
  });
});
