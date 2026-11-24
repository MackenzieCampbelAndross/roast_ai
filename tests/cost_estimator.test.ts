import { describe, it, expect } from 'vitest';
import { CostEstimator, PRICING_TIERS } from '../src/core/cost_estimator';

describe('CostEstimator', () => {
  it('calculates token costs accurately across provider pricing tiers', () => {
    const res = CostEstimator.estimateCostUSD(1000, 500, 'gpt-4o-mini');
    expect(parseFloat(res.costUSD)).toBeGreaterThan(0);
    expect(res.costUSD).toBeDefined();

    const localRes = CostEstimator.estimateCostUSD(1000, 500, 'local-mock');
    expect(localRes.costUSD).toBe('0.000000');
  });

  it('includes major foundation models in pricing registry', () => {
    expect(PRICING_TIERS['gpt-4o-mini']).toBeDefined();
    expect(PRICING_TIERS['claude-3-5-haiku']).toBeDefined();
    expect(PRICING_TIERS['gemini-1-5-flash']).toBeDefined();
  });
});
