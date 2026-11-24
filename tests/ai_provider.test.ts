import { describe, it, expect } from 'vitest';
import { DeterministicComedyProvider } from '../src/core/ai_provider';
import { getPersonalityById } from '../src/core/personalities';

describe('AIModelProvider', () => {
  it('generates primary comedy content with alternatives and token accounting', async () => {
    const provider = new DeterministicComedyProvider();
    const personality = getPersonalityById('roastmaster');

    const res = await provider.generateRoast({
      inputType: 'TEXT',
      promptText: 'My daily fashion sense',
      personality,
      intensity: 'SPICY'
    });

    expect(res.primaryRoast).toBeDefined();
    expect(res.primaryRoast).toContain('My daily fashion sense');
    expect(res.alternatives.length).toBe(2);
    expect(res.promptTokens).toBeGreaterThan(0);
    expect(res.completionTokens).toBeGreaterThan(0);
    expect(parseFloat(res.costUSD)).toBeGreaterThan(0);
  });

  it('adapts tone appropriately across different personalities', async () => {
    const provider = new DeterministicComedyProvider();

    const techRes = await provider.generateRoast({
      inputType: 'TEXT',
      promptText: 'My life plan',
      personality: getPersonalityById('tech_bro'),
      intensity: 'MEDIUM'
    });
    expect(techRes.primaryRoast).toContain('product-market fit');

    const victorianRes = await provider.generateRoast({
      inputType: 'TEXT',
      promptText: 'My manners',
      personality: getPersonalityById('victorian_noble'),
      intensity: 'MILD'
    });
    expect(victorianRes.primaryRoast).toContain('Victorian London');
  });
});
