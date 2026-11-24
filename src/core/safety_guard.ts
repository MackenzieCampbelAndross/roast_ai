/**
 * Two-stage content moderation and safety guardrail engine for Roast.ai.
 * Enforces strict input validation and output safety checks to prevent hate speech,
 * self-harm, doxxing, and non-consensual harassment while preserving comedic wit.
 */

import { SafetyCheckResult, RoastIntensity } from '../types';

export class SafetyGuard {
  // Prohibited safety categories (Zero-Tolerance)
  private static SEVERE_HATE_SPEECH = /\b(genocide|lynch|white supremacy|nazi|holocaust denial)\b/i;
  private static SELF_HARM = /\b(suicide|kill yourself|slit your wrists|end your life|hang yourself)\b/i;
  private static SEVERE_HARASSMENT = /\b(doxx|swatting|leak your address|find where you live)\b/i;
  private static PII_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b(?:\d{4}[-\s]?){3}\d{4}\b/, // Credit Card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // Email
  ];

  // Mild profanity / slurs filter
  private static TOXIC_TERMS = /\b(retard|faggot|nigger|kike|chink|spic)\b/i;

  /**
   * Stage 1: Validates user-submitted prompts or image metadata before inference.
   */
  static validateInput(input: string): SafetyCheckResult {
    if (!input || !input.trim()) {
      return { safe: false, score: 0.0, flags: ['EMPTY_INPUT'], reason: 'Input prompt cannot be empty.' };
    }

    const trimmed = input.trim();
    const flags: string[] = [];

    // 1. Check Self-Harm
    if (this.SELF_HARM.test(trimmed)) {
      return {
        safe: false,
        score: 0.0,
        flags: ['SELF_HARM'],
        reason: 'Input contains references to self-harm or suicide. Request blocked.'
      };
    }

    // 2. Check Severe Hate Speech & Slurs
    if (this.SEVERE_HATE_SPEECH.test(trimmed) || this.TOXIC_TERMS.test(trimmed)) {
      return {
        safe: false,
        score: 0.0,
        flags: ['HATE_SPEECH'],
        reason: 'Input violates safety guidelines regarding hate speech and discriminatory slurs.'
      };
    }

    // 3. Check Harassment / Threats
    if (this.SEVERE_HARASSMENT.test(trimmed)) {
      return {
        safe: false,
        score: 0.0,
        flags: ['HARASSMENT'],
        reason: 'Input contains harassment or personal threat patterns.'
      };
    }

    // 4. Check PII
    for (const piiRegex of this.PII_PATTERNS) {
      if (piiRegex.test(trimmed)) {
        flags.push('PII_DETECTED');
        return {
          safe: false,
          score: 0.3,
          flags,
          reason: 'Input appears to contain personal identifiable information (PII).'
        };
      }
    }

    return { safe: true, score: 1.0, flags: [] };
  }

  /**
   * Stage 2: Validates AI-generated punchlines before delivery to the client.
   */
  static validateOutput(output: string, intensity: RoastIntensity): SafetyCheckResult {
    if (!output || !output.trim()) {
      return { safe: false, score: 0.0, flags: ['EMPTY_OUTPUT'], reason: 'Generated output was blank.' };
    }

    // Severe checks apply unconditionally
    if (this.SELF_HARM.test(output) || this.SEVERE_HATE_SPEECH.test(output) || this.TOXIC_TERMS.test(output)) {
      return {
        safe: false,
        score: 0.0,
        flags: ['TOXIC_OUTPUT'],
        reason: 'Generated comedy crossed critical safety boundaries and was suppressed.'
      };
    }

    // Mild intensity: ensure no excessively harsh curse words
    if (intensity === 'MILD') {
      if (/\b(fuck|shit|bitch|bastard)\b/i.test(output)) {
        return {
          safe: false,
          score: 0.5,
          flags: ['INTENSITY_MISMATCH'],
          reason: 'Language was too harsh for Mild comedy intensity.'
        };
      }
    }

    return { safe: true, score: 0.98, flags: [] };
  }
}
