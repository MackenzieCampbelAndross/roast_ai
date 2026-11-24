import { describe, it, expect } from 'vitest';
import { RoastGenerator } from '../src/core/roast_generator';

describe('RoastGenerator', () => {
  it('orchestrates end-to-end roast generation with safety and metadata', async () => {
    const generator = new RoastGenerator();

    const result = await generator.generate({
      inputType: 'TEXT',
      inputText: 'Junior software engineer who tests in production',
      personalityId: 'tech_bro',
      intensity: 'SPICY'
    });

    expect(result.id).toBeDefined();
    expect(result.personality.id).toBe('tech_bro');
    expect(result.intensity).toBe('SPICY');
    expect(result.roastContent.length).toBeGreaterThan(20);
    expect(result.alternatives.length).toBe(2);
    expect(result.safetyScore).toBeGreaterThanOrEqual(0.9);
  });

  it('blocks generation when input fails safety inspection', async () => {
    const generator = new RoastGenerator();

    await expect(generator.generate({
      inputType: 'TEXT',
      inputText: 'kill yourself now',
      personalityId: 'roastmaster',
      intensity: 'MILD'
    })).rejects.toThrow(/self-harm/);
  });

  it('regenerates roasts maintaining context or updating intensity', async () => {
    const generator = new RoastGenerator();

    const initial = await generator.generate({
      inputType: 'TEXT',
      inputText: 'Couch potato streaming marathon',
      personalityId: 'gen_z_menace',
      intensity: 'MEDIUM'
    });

    const regenerated = await generator.regenerate(initial, 'SCORCHED_EARTH');
    expect(regenerated.id).not.toBe(initial.id);
    expect(regenerated.intensity).toBe('SCORCHED_EARTH');
  });
});
