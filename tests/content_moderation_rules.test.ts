import { describe, it, expect } from 'vitest';
import { MODERATION_RULES, ModerationRuleRegistry } from '../src/core/content_moderation_rules';

describe('ModerationRuleRegistry', () => {
  it('registers all core safety categories with critical severity', () => {
    expect(MODERATION_RULES.length).toBeGreaterThanOrEqual(5);

    const selfHarmRule = ModerationRuleRegistry.getRule('MOD_01');
    expect(selfHarmRule).toBeDefined();
    expect(selfHarmRule?.category).toBe('SELF_HARM');
    expect(selfHarmRule?.severity).toBe('CRITICAL');
  });

  it('filters rules by safety category', () => {
    const piiRules = ModerationRuleRegistry.getRulesByCategory('PII_LEAK');
    expect(piiRules.length).toBe(1);
    expect(piiRules[0].action).toBe('BLOCK');
  });
});
