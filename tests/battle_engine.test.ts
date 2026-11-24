import { describe, it, expect } from 'vitest';
import { BattleEngine } from '../src/core/battle_engine';

describe('BattleEngine', () => {
  it('conducts head-to-head comedy battle and crowns a victor with score metrics', async () => {
    const engine = new BattleEngine();

    const battle = await engine.conductBattle(
      'Tabs Enthusiast',
      'Uses 4-space indentation religiously and refuses spaces',
      'Spaces Purist',
      'Uses 2-space indentation and writes custom ESLint linters',
      'SPICY'
    );

    expect(battle.id).toBeDefined();
    expect(battle.title).toContain('Tabs Enthusiast vs Spaces Purist');
    expect(battle.sideA.roast.roastContent).toBeDefined();
    expect(battle.sideB.roast.roastContent).toBeDefined();
    expect(battle.sideA.score).toBeGreaterThan(0);
    expect(battle.sideB.score).toBeGreaterThan(0);
    expect(['A', 'B', 'DRAW']).toContain(battle.winnerSide);
    expect(battle.judgeVerdict.length).toBeGreaterThan(15);
  });
});
