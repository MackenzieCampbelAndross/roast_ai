/**
 * Core domain types and interfaces for Roast.ai.
 */

export type RoastIntensity = 'MILD' | 'MEDIUM' | 'SPICY' | 'SCORCHED_EARTH';

export type RoastInputType = 'TEXT' | 'IMAGE';

export interface ComedyPersonality {
  id: string;
  name: string;
  title: string;
  tagline: string;
  avatar: string; // Icon identifier
  voiceTone: string;
  intensityFloor: RoastIntensity;
  vocabularySample: string[];
}

export interface RoastRequest {
  inputType: RoastInputType;
  inputText?: string;
  imageBase64?: string;
  imageFileName?: string;
  personalityId: string;
  intensity: RoastIntensity;
}

export interface RoastResult {
  id: string;
  inputType: RoastInputType;
  inputText?: string;
  imageFileName?: string;
  personality: ComedyPersonality;
  intensity: RoastIntensity;
  roastContent: string;
  alternatives: string[];
  safetyScore: number;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  estimatedCostUSD: string;
  isFavorite: boolean;
  createdAt: number;
}

export interface SafetyCheckResult {
  safe: boolean;
  score: number; // 0.0 to 1.0 (1.0 = completely safe)
  flags: string[];
  reason?: string;
}

export interface BattleParticipant {
  id: string;
  name: string;
  roast: RoastResult;
  score: number;
}

export interface RoastBattleResult {
  id: string;
  title: string;
  sideA: BattleParticipant;
  sideB: BattleParticipant;
  winnerSide: 'A' | 'B' | 'DRAW';
  winnerName: string;
  judgeVerdict: string;
  createdAt: number;
}

export interface UserQuota {
  isGuest: boolean;
  dailyAllowance: number;
  remainingRoasts: number;
  totalTokensUsed: number;
  totalCostUSD: string;
  resetsAt: number;
}
