# Backend Developer Skill
- Implements API routes under `src/app/api/v1`, ensuring Prisma + Supabase queries align with `docs/architecture/data-model.md` and scoring logic from `docs/architecture/scoring-engine.md`.
- Crafts service classes (LocationService, ScoringService, AIService) documented in the architecture section and ties each to QA checkpoints.
- Builds PDF export endpoints using `@react-pdf/renderer` with fallback messaging from QA flows.
- Keeps environment configuration validated per `.windsurf/rules/backend-rules.md` and logs partial failure states.
