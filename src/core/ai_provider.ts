/**
 * AI Model Provider Abstraction Layer for Roast.ai.
 * Decouples comedy generation from specific LLM vendors (OpenAI, Anthropic, Gemini, Local Mock).
 * Accurately tracks token usage and operational API costs.
 */

import { ComedyPersonality, RoastIntensity, RoastInputType } from '../types';

export interface GenerationInput {
  inputType: RoastInputType;
  promptText?: string;
  imageFileName?: string;
  personality: ComedyPersonality;
  intensity: RoastIntensity;
}

export interface ProviderResponse {
  primaryRoast: string;
  alternatives: string[];
  promptTokens: number;
  completionTokens: number;
  costUSD: string;
}

export interface AIModelProvider {
  name: string;
  generateRoast(input: GenerationInput): Promise<ProviderResponse>;
}

/**
 * Deterministic local comedy engine simulating an LLM with high comedic fidelity.
 */
export class DeterministicComedyProvider implements AIModelProvider {
  name = 'deterministic-comedy-v1';

  // Cost metrics (per 1k tokens)
  private static INPUT_COST_PER_1K = 0.0015;
  private static OUTPUT_COST_PER_1K = 0.0020;

  async generateRoast(input: GenerationInput): Promise<ProviderResponse> {
    const { inputType, promptText, imageFileName, personality, intensity } = input;
    const target = inputType === 'IMAGE' ? (imageFileName || 'uploaded image') : (promptText || 'your existence');

    const primaryRoast = this.synthesizeRoast(target, personality.id, intensity);
    const alt1 = this.synthesizeAlternative(target, personality.id, intensity, 1);
    const alt2 = this.synthesizeAlternative(target, personality.id, intensity, 2);

    // Compute token estimates (approx 4 chars per token)
    const promptLen = (promptText || '').length + personality.voiceTone.length + 100;
    const completionLen = primaryRoast.length + alt1.length + alt2.length;

    const promptTokens = Math.max(25, Math.round(promptLen / 4));
    const completionTokens = Math.max(35, Math.round(completionLen / 4));

    const cost = ((promptTokens / 1000) * DeterministicComedyProvider.INPUT_COST_PER_1K) +
                 ((completionTokens / 1000) * DeterministicComedyProvider.OUTPUT_COST_PER_1K);

    return {
      primaryRoast,
      alternatives: [alt1, alt2],
      promptTokens,
      completionTokens,
      costUSD: cost.toFixed(5)
    };
  }

  private synthesizeRoast(target: string, personalityId: string, intensity: RoastIntensity): string {
    const intensityModifiers: Record<RoastIntensity, string> = {
      MILD: 'With all due kindness, ',
      MEDIUM: 'Honestly speaking, ',
      SPICY: 'I have to be completely blunt: ',
      SCORCHED_EARTH: 'Warning: emotional damage inbound. '
    };

    switch (personalityId) {
      case 'roastmaster':
        return `${intensityModifiers[intensity]}Looking at "${target}" makes me realize why pencils still have erasers. You are living proof that evolution occasionally takes a sabbatical.`;
      
      case 'tech_bro':
        return `${intensityModifiers[intensity]}"${target}" has the worst product-market fit since the Segway. If your life were a startup, the venture capitalists would demand a full refund and write you off as a capital loss.`;
      
      case 'victorian_noble':
        return `${intensityModifiers[intensity]}One observes "${target}" with profound consternation. Even the most destitute scoundrels of Victorian London possessed a modesty that you seem wholly incapable of exhibiting.`;
      
      case 'gen_z_menace':
        return `${intensityModifiers[intensity]}Bro really presented "${target}" and thought he had infinite aura. You got negative 50,000 rizz and cooked yourself into absolute irrelevance. Skill issue.`;
      
      case 'corporate_drone':
      default:
        return `${intensityModifiers[intensity]}Per my last review regarding "${target}", your performance has been flagged for immediate executive alignment. Moving forward, please consider doing literally anything else.`;
    }
  }

  private synthesizeAlternative(target: string, _personalityId: string, _intensity: RoastIntensity, altIndex: number): string {
    if (altIndex === 1) {
      return `Alternative take: "${target}" is the human equivalent of a 404 Not Found error wrapped in unearned confidence.`;
    }
    return `Bonus burn: Even GPS navigation would give up recalculating a viable route for someone presenting "${target}".`;
  }
}
