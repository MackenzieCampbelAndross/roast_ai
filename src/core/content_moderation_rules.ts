/**
 * Content moderation rule catalog and category definitions for Roast.ai.
 * Standardizes safety violation categories and severity tiers.
 */

export type SafetyCategory = 
  | 'HATE_SPEECH'
  | 'HARASSMENT'
  | 'SELF_HARM'
  | 'SEXUAL_CONTENT'
  | 'PII_LEAK'
  | 'ILLEGAL_ACTS';

export interface ModerationRule {
  id: string;
  category: SafetyCategory;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  action: 'BLOCK' | 'FLAG' | 'SANITIZE';
}

export const MODERATION_RULES: ModerationRule[] = [
  { id: 'MOD_01', category: 'SELF_HARM', description: 'Explicit encouragement or instructions for self-harm or suicide', severity: 'CRITICAL', action: 'BLOCK' },
  { id: 'MOD_02', category: 'HATE_SPEECH', description: 'Dehumanizing language, slurs, or promotion of violence against protected groups', severity: 'CRITICAL', action: 'BLOCK' },
  { id: 'MOD_03', category: 'HARASSMENT', description: 'Targeted doxxing, physical threats, or non-consensual personal degradation', severity: 'HIGH', action: 'BLOCK' },
  { id: 'MOD_04', category: 'PII_LEAK', description: 'Social security numbers, credit cards, telephone numbers, or private emails', severity: 'HIGH', action: 'BLOCK' },
  { id: 'MOD_05', category: 'SEXUAL_CONTENT', description: 'Non-consensual sexual imagery or sexually explicit harassment', severity: 'CRITICAL', action: 'BLOCK' }
];

export class ModerationRuleRegistry {
  static getRule(id: string): ModerationRule | undefined {
    return MODERATION_RULES.find(r => r.id === id);
  }

  static getRulesByCategory(cat: SafetyCategory): ModerationRule[] {
    return MODERATION_RULES.filter(r => r.category === cat);
  }
}
