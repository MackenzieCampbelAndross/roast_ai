/**
 * Model cost estimator and token calculator for Roast.ai.
 * Evaluates inference expenses across different AI model providers.
 */

export interface ModelPricingTier {
  modelId: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Local';
  inputCostPer1M: number;
  outputCostPer1M: number;
}

export const PRICING_TIERS: Record<string, ModelPricingTier> = {
  'gpt-4o-mini': { modelId: 'gpt-4o-mini', provider: 'OpenAI', inputCostPer1M: 0.15, outputCostPer1M: 0.60 },
  'claude-3-5-haiku': { modelId: 'claude-3-5-haiku', provider: 'Anthropic', inputCostPer1M: 0.25, outputCostPer1M: 1.25 },
  'gemini-1-5-flash': { modelId: 'gemini-1-5-flash', provider: 'Google', inputCostPer1M: 0.075, outputCostPer1M: 0.30 },
  'local-mock': { modelId: 'local-mock', provider: 'Local', inputCostPer1M: 0.00, outputCostPer1M: 0.00 }
};

export class CostEstimator {
  static estimateCostUSD(
    promptTokens: number,
    completionTokens: number,
    modelId: string = 'gpt-4o-mini'
  ): { costUSD: string; promptCostUSD: string; completionCostUSD: string } {
    const tier = PRICING_TIERS[modelId] || PRICING_TIERS['gpt-4o-mini'];

    const promptCost = (promptTokens / 1_000_000) * tier.inputCostPer1M;
    const completionCost = (completionTokens / 1_000_000) * tier.outputCostPer1M;
    const total = promptCost + completionCost;

    return {
      costUSD: total.toFixed(6),
      promptCostUSD: promptCost.toFixed(6),
      completionCostUSD: completionCost.toFixed(6)
    };
  }
}
