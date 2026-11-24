import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '../src/core/rate_limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    RateLimiter.resetForTesting();
  });

  it('provides default guest quota allowance', () => {
    const quota = RateLimiter.getQuota();
    expect(quota.isGuest).toBe(true);
    expect(quota.dailyAllowance).toBe(5);
    expect(quota.remainingRoasts).toBe(5);
    expect(RateLimiter.canGenerate()).toBe(true);
  });

  it('decrements remaining roasts and accumulates token accounting', () => {
    RateLimiter.recordUsage(150, '0.00030');
    let quota = RateLimiter.getQuota();
    expect(quota.remainingRoasts).toBe(4);
    expect(quota.totalTokensUsed).toBe(150);
    expect(quota.totalCostUSD).toBe('0.00030');

    // Use remaining allowance
    RateLimiter.recordUsage(100, '0.00020');
    RateLimiter.recordUsage(100, '0.00020');
    RateLimiter.recordUsage(100, '0.00020');
    RateLimiter.recordUsage(100, '0.00020');

    quota = RateLimiter.getQuota();
    expect(quota.remainingRoasts).toBe(0);
    expect(RateLimiter.canGenerate()).toBe(false);
  });
});
