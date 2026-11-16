import { describe, expect, it } from 'vitest';
import { computeWeightedAverageCost } from './cump.js';

describe('computeWeightedAverageCost', () => {
  it('calcule le CUMP classique (10×5 + 10×7 = 20×6)', () => {
    const afterFirst = computeWeightedAverageCost(0, '0.000000', 10, '5.000000');
    expect(afterFirst).toBe('5.000000');

    const cump = computeWeightedAverageCost(10, afterFirst, 10, '7.000000');
    expect(cump).toBe('6.000000');
  });

  it('isole les valorisations par entrepôt (deux chaînes indépendantes)', () => {
    const central = computeWeightedAverageCost(0, '0.000000', 10, '5.000000');
    const boutique = computeWeightedAverageCost(0, '0.000000', 10, '7.000000');

    expect(
      computeWeightedAverageCost(10, central, 10, '5.000000'),
    ).toBe('5.000000');
    expect(
      computeWeightedAverageCost(10, boutique, 10, '7.000000'),
    ).toBe('7.000000');
  });
});
