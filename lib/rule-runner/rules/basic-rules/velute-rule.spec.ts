import { describe, expect, it } from 'vitest';
import { VeluteRule } from './velute-rule';
import { RuleEffectEvent, RuleEffects } from '../rule-effect';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder';

describe('isApplicableToDiceRoll', () => {
  it('returns true if two dice sum equals the third one', () => {
    const rule = new VeluteRule();

    expect(rule.isApplicableToDiceRoll([4, 1, 5])).toBe(true);
  });

  it('returns false if there is no way two dice sum equals the third one', () => {
    const rule = new VeluteRule();

    expect(rule.isApplicableToDiceRoll([1, 6, 3])).toBe(false);
  });
});

describe('applyRule', () => {
  it('registers a change of score of 32 for a velute of 4', () => {
    const effects = new VeluteRule().applyRule(
      DummyContextBuilder.aDiceRollContext()
        .withplayer('Alban')
        .withDiceRoll([3, 4, 1])
        .build(),
    );

    expect(effects).toEqual<RuleEffects>([
      {
        player: 'Alban',
        event: RuleEffectEvent.VELUTE,
        value: 32,
      },
    ]);
  });
});
