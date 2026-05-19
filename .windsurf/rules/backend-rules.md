# Backend Rules
1. Roll API routes inside Next.js `src/app/api/v1` handlers with authentication middleware (per QA flow) and Prisma/Supabase data access.
2. Validate all incoming payloads with Zod schemas; log validation errors and return consistent HTTP codes (400 for invalid data, 401 unauthorized, 500 for service failure).
3. Keep services modular: `LocationService`, `ScoringService`, `AIService`, `PDFService`, each described in `docs/architecture/technical-architecture.md` and mapped to QA flow checkpoints.
4. Protect third-party secrets via environment variables; read from validated `env` module (documented in `docs/external-setup-guide.md`) and fail-fast if a required secret is missing.
5. Implement retries/backoff when calling Google APIs or OpenAI and mark reports with `COMPLETED_WITH_WARNINGS` plus log entries when partial data is used.
6. Store scoring metadata and status transitions in the database (see `docs/architecture/data-model.md` and `docs/architecture/scoring-engine.md`) and expose them via the GET endpoints described in QA flows.
