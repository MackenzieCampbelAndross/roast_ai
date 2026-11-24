# Testing Strategy & Verification: Roast.ai

## 1. Overview
Roast.ai adheres to a strict multi-tier testing pipeline ensuring ethical comedy, two-stage safety enforcement, reliable provider abstractions, and deterministic score evaluations:
- **Two-Stage Safety Verification**: Validates input moderation (self-harm, hate speech, PII) and output moderation (intensity calibration).
- **Comedy Engine Tests**: Validates personality prompt synthesizers and alternative generation.
- **Battle & Accounting Tests**: Head-to-head comedy tournament scoring, rate limiting quotas, and token pricing calculations.

## 2. Test Execution
```bash
# Run complete automated test suite (11 test suites, 25 tests)
npm test

# Run tests in watch mode
npm run test:watch
```

## 3. Verified Test Matrix
| Test Suite | Purpose | Status |
| :--- | :--- | :--- |
| `tests/safety_guard.test.ts` | Two-stage input and output moderation, self-harm, hate speech, PII | PASS |
| `tests/content_moderation_rules.test.ts` | Safety rule registry catalog and severity rankings | PASS |
| `tests/personalities.test.ts` | 5 comedy archetypes, vocabulary samples, default fallback | PASS |
| `tests/ai_provider.test.ts` | Provider abstraction, token metrics, deterministic comedy generation | PASS |
| `tests/roast_generator.test.ts` | Master orchestrator, alternative punchlines, intensity regeneration | PASS |
| `tests/battle_engine.test.ts` | 2-player comedy arena, punchline scoring, winner determination | PASS |
| `tests/rate_limiter.test.ts` | Guest quotas, token usage accumulation, daily reset cycle | PASS |
| `tests/cost_estimator.test.ts` | Foundation model token pricing (GPT-4o, Claude 3.5, Gemini 1.5) | PASS |
| `tests/card_generator.test.ts` | Social image card SVG markup generation and XML escaping | PASS |
| `tests/history_store.test.ts` | Persistent local library, favorite toggles, battle archives | PASS |
| `tests/integration_roast.test.ts` | Full lifecycle end-to-end prompt to card and battle execution | PASS |

## 4. Test Metrics & Coverage
- **Pass Rate:** 100% (25/25 passing tests across 11 test suites)
- **Safety Compliance:** Zero-tolerance verification for self-harm, harassment, and PII
- **Build Status:** Production Vite bundle compiled cleanly with 0 TypeScript errors
