import { describe, it, expect } from 'vitest';
import { PERSONALITIES, getPersonalityById } from '../src/core/personalities';

describe('Personalities', () => {
  it('registers all 5 distinct comedy archetypes', () => {
    expect(PERSONALITIES.length).toBe(5);
    const ids = PERSONALITIES.map(p => p.id);
    expect(ids).toContain('roastmaster');
    expect(ids).toContain('tech_bro');
    expect(ids).toContain('victorian_noble');
    expect(ids).toContain('gen_z_menace');
    expect(ids).toContain('corporate_drone');
  });

  it('retrieves personality by ID and safely falls back on unknown ID', () => {
    const tech = getPersonalityById('tech_bro');
    expect(tech.name).toBe('The Sarcastic Tech Bro');

    const fallback = getPersonalityById('non_existent_id');
    expect(fallback.id).toBe('roastmaster');
  });

  it('contains vocabulary samples and intensity floors for all personalities', () => {
    for (const p of PERSONALITIES) {
      expect(p.vocabularySample.length).toBeGreaterThan(0);
      expect(p.intensityFloor).toBeDefined();
    }
  });
});
