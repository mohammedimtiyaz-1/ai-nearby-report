# Technical Architecture
The architecture follows the modular services described in `docs/qa-user-flows.md`.
- **UI Layer**: Next.js App Router pages, each referencing design specs so UX states (loading, error, success) align with QA flows.
- **API Layer**: Route handlers under `src/app/api/v1` call into services (Location, Scoring, AI, PDF) and return well-formed JSON.
- **Data Layer**: Prisma schema (planned) uses Supabase Postgres with PostGIS extension for geospatial queries.
- **Security**: NextAuth sessions and bcrypt hashing, environment var validation from `.windsurf/rules/backend-rules.md`.
- **Observability**: Add logging/metrics for each service and ensure failure states are captured in `docs/architecture/security-observability-accessibility.md` once written.

The QA flows doc ensures these components interact predictably: e.g., scoring results feed into AI summary and status chips shown on the dashboard.
