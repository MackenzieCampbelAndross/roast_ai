/**
 * Rate limiting and quota management service for Roast.ai.
 * Enforces guest allowances, tracks daily usage buckets, and monitors cumulative AI costs.
 */

import { UserQuota } from '../types';

export class RateLimiter {
  private static STORAGE_KEY = 'roastai_user_quota_v1';
  private static GUEST_DAILY_LIMIT = 5;
  private static inMemoryQuota: UserQuota = {
    isGuest: true,
    dailyAllowance: 5,
    remainingRoasts: 5,
    totalTokensUsed: 0,
    totalCostUSD: '0.00000',
    resetsAt: Date.now() + 24 * 60 * 60 * 1000
  };

  static getQuota(): UserQuota {
    this.hydrate();
    // Check if reset period has elapsed
    if (Date.now() > this.inMemoryQuota.resetsAt) {
      this.inMemoryQuota.remainingRoasts = this.inMemoryQuota.dailyAllowance;
      this.inMemoryQuota.resetsAt = Date.now() + 24 * 60 * 60 * 1000;
      this.persist();
    }
    return { ...this.inMemoryQuota };
  }

  static canGenerate(): boolean {
    const quota = this.getQuota();
    return quota.remainingRoasts > 0;
  }

  static recordUsage(tokens: number, costUSD: string): void {
    const quota = this.getQuota();
    if (quota.remainingRoasts > 0) {
      quota.remainingRoasts--;
    }
    quota.totalTokensUsed += tokens;
    const currentCost = parseFloat(quota.totalCostUSD) || 0;
    const additional = parseFloat(costUSD) || 0;
    quota.totalCostUSD = (currentCost + additional).toFixed(5);

    this.inMemoryQuota = quota;
    this.persist();
  }

  static resetForTesting(): void {
    this.inMemoryQuota = {
      isGuest: true,
      dailyAllowance: this.GUEST_DAILY_LIMIT,
      remainingRoasts: this.GUEST_DAILY_LIMIT,
      totalTokensUsed: 0,
      totalCostUSD: '0.00000',
      resetsAt: Date.now() + 24 * 60 * 60 * 1000
    };
    this.persist();
  }

  private static persist(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inMemoryQuota));
      } catch {}
    }
  }

  private static hydrate(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          this.inMemoryQuota = JSON.parse(raw);
        }
      } catch {}
    }
  }
}
