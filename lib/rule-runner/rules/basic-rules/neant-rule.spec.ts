import { describe, expect, it } from 'vitest';
import { NeantRule } from './neant-rule';
import { RuleEffect, RuleEffectEvent } from '../rule-effect';
import { DummyContextBuilder } from '../../../tests/dummy-game-context-builder';

describe('isApplicableToDiceRoll', () => {
  it('returns always true', function () {
    const rule = new NeantRule();

    expect(rule.isApplicableToDiceRoll()).toBe(true);
  });
});

describe('applyRule', () => {
  it('applies a grelottine to the current player', () => {
    const effects = new NeantRule().applyRule(
      DummyContextBuilder.aDiceRollContext().withplayer('Alban').build(),
    );

    expect(effects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.ADD_GRELOTTINE,
      player: 'Alban',
      value: 0,
    });
  });

  it('registers a change of score the the current player', () => {
    const effects = new NeantRule().applyRule(
      DummyContextBuilder.aDiceRollContext().withplayer('Alban').build(),
    );

    expect(effects).toContainEqual<RuleEffect>({
      event: RuleEffectEvent.NEANT,
      player: 'Alban',
      value: 0,
    });
  });
});
