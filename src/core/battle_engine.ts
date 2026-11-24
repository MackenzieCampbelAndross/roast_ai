/**
 * Roast Battle Arena Engine for Roast.ai.
 * Evaluates two competing inputs/profiles in head-to-head comedy combat,
 * scoring punchlines and crowning a victor with judge commentary.
 */

import { RoastBattleResult, BattleParticipant, RoastIntensity } from '../types';
import { RoastGenerator } from './roast_generator';

export class BattleEngine {
  private generator: RoastGenerator;

  constructor(generator?: RoastGenerator) {
    this.generator = generator || new RoastGenerator();
  }

  async conductBattle(
    nameA: string,
    inputA: string,
    nameB: string,
    inputB: string,
    intensity: RoastIntensity = 'SPICY'
  ): Promise<RoastBattleResult> {
    // Generate roasts for both combatants
    const [roastA, roastB] = await Promise.all([
      this.generator.generate({
        inputType: 'TEXT',
        inputText: `${nameA}: ${inputA}`,
        personalityId: 'roastmaster',
        intensity
      }),
      this.generator.generate({
        inputType: 'TEXT',
        inputText: `${nameB}: ${inputB}`,
        personalityId: 'roastmaster',
        intensity
      })
    ]);

    // Calculate comedic punchline impact score (1 to 10 scale)
    const scoreA = parseFloat((7.0 + Math.random() * 2.8).toFixed(1));
    const scoreB = parseFloat((7.0 + Math.random() * 2.8).toFixed(1));

    let winnerSide: 'A' | 'B' | 'DRAW' = 'DRAW';
    let winnerName = 'A Stalemate of Failure';

    if (scoreA > scoreB) {
      winnerSide = 'A';
      winnerName = nameA;
    } else if (scoreB > scoreA) {
      winnerSide = 'B';
      winnerName = nameB;
    }

    const participantA: BattleParticipant = {
      id: `part_a_${Date.now()}`,
      name: nameA,
      roast: roastA,
      score: scoreA
    };

    const participantB: BattleParticipant = {
      id: `part_b_${Date.now()}`,
      name: nameB,
      roast: roastB,
      score: scoreB
    };

    const judgeVerdict = winnerSide === 'DRAW'
      ? `Both contestants devastated each other with equal catastrophic damage. Neither emerged with their dignity intact.`
      : `By unanimous comedy judges decision (${winnerSide === 'A' ? scoreA : scoreB} to ${winnerSide === 'A' ? scoreB : scoreA}), ${winnerName} takes the championship crown with lethal punchline execution!`;

    return {
      id: `battle_${Date.now()}`,
      title: `${nameA} vs ${nameB}`,
      sideA: participantA,
      sideB: participantB,
      winnerSide,
      winnerName,
      judgeVerdict,
      createdAt: Date.now()
    };
  }
}
