/**
 * Master Roast Generator Orchestrator for Roast.ai.
 * Coordinates input validation, AI model inference, output safety moderation, and cost tracking.
 */

import { RoastRequest, RoastResult } from '../types';
import { SafetyGuard } from './safety_guard';
import { getPersonalityById } from './personalities';
import { AIModelProvider, DeterministicComedyProvider } from './ai_provider';

export class RoastGenerator {
  private provider: AIModelProvider;

  constructor(provider?: AIModelProvider) {
    this.provider = provider || new DeterministicComedyProvider();
  }

  async generate(request: RoastRequest): Promise<RoastResult> {
    const personality = getPersonalityById(request.personalityId);

    // 1. Stage 1 Safety: Input Moderation
    if (request.inputType === 'TEXT' && request.inputText) {
      const inputCheck = SafetyGuard.validateInput(request.inputText);
      if (!inputCheck.safe) {
        throw new Error(inputCheck.reason || 'Input violated safety guardrails.');
      }
    }

    // 2. Inference via Provider Abstraction
    const rawResponse = await this.provider.generateRoast({
      inputType: request.inputType,
      promptText: request.inputText,
      imageFileName: request.imageFileName,
      personality,
      intensity: request.intensity
    });

    // 3. Stage 2 Safety: Output Moderation
    const outputCheck = SafetyGuard.validateOutput(rawResponse.primaryRoast, request.intensity);
    if (!outputCheck.safe) {
      throw new Error(outputCheck.reason || 'Generated comedy violated safety rules.');
    }

    return {
      id: `roast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      inputType: request.inputType,
      inputText: request.inputText,
      imageFileName: request.imageFileName,
      personality,
      intensity: request.intensity,
      roastContent: rawResponse.primaryRoast,
      alternatives: rawResponse.alternatives,
      safetyScore: outputCheck.score,
      tokensUsed: {
        prompt: rawResponse.promptTokens,
        completion: rawResponse.completionTokens,
        total: rawResponse.promptTokens + rawResponse.completionTokens
      },
      estimatedCostUSD: rawResponse.costUSD,
      isFavorite: false,
      createdAt: Date.now()
    };
  }

  async regenerate(previous: RoastResult, newIntensity?: RoastResult['intensity']): Promise<RoastResult> {
    return this.generate({
      inputType: previous.inputType,
      inputText: previous.inputText,
      imageFileName: previous.imageFileName,
      personalityId: previous.personality.id,
      intensity: newIntensity || previous.intensity
    });
  }
}
