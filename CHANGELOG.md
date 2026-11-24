# Changelog: Roast.ai

All notable changes to this project are documented in this file in accordance with Keep a Changelog standards.

## [0.1.0] - 2026-11-24
### Added
- **Two-Stage Content Moderation:** Comprehensive safety filter inspecting both input prompts (self-harm, hate speech, harassment, PII) and generated outputs.
- **5 Distinct Comedy Personalities:** The Roastmaster General, The Sarcastic Tech Bro, The Victorian Aristocrat, The Gen Z Menace, and Passive-Aggressive HR.
- **4-Tier Humour Intensity:** Mild, Medium, Spicy, and Scorched Earth calibration modes.
- **AI Model Provider Abstraction:** Vendor-agnostic LLM interface with deterministic local comedy engine and token/cost tracking.
- **Alternative Roast Generation:** Automated creation of multiple distinct comedic angles and punchlines per prompt.
- **Roast Battle Arena:** 2-player head-to-head comedy combat arena with algorithmic punchline scoring, winner coronation, and referee commentary.
- **Shareable Social Image Cards:** Automated vector SVG card generator with custom styling and branding for Twitter, Discord, and Instagram.
- **Rate Limiting & Guest Quotas:** Token bucket algorithm providing 5 daily free roasts with real-time token tracking.
- **Local History & Favorites Vault:** Persistent local library for saving, searching, favoriting, and exporting burns.
- **Prisma Relational Schema:** PostgreSQL database models for Users, Roasts, RoastBattles, BattleParticipants, and SafetyAudits.
- **Automated Test Matrix:** 11 Vitest test suites with 25 unit and integration tests passing at 100%.
