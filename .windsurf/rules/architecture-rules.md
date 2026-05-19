# Architecture Rules
1. Capture the system context from `docs/technical-specification.md` (Next.js, Prisma, Supabase, OpenAI, NextAuth) and keep the architecture overview updated in `docs/architecture/system-overview.md`.
2. Prioritize stateless services for API routes; use Next.js route handlers that pass through authentication middleware and connection pooling as described in the QA flows `docs/qa-user-flows.md`.
3. All external service integrations (Google Maps/Places, OpenAI, Supabase) must include retries/backoff, proper error handling, and state markers so UI flows can show `COMPLETED_WITH_WARNINGS` statuses.
4. Document high-level components (UI, API, scoring, AI, PDF generation) inside `docs/architecture/technical-architecture.md` and keep diagrams/text aligned with the `scoring-engine` and `ai-report-generation` pages.
5. Keep PostGIS usage explicit: mention the spatial tables and indexes in `docs/architecture/data-model.md`, plus the scoring formulas in `docs/architecture/scoring-engine.md`.
6. Adopt ADRs for every architectural deviation in `docs/decisions/adr-template.md`, referencing the QA flows where relevant (e.g., additional status resilience).
