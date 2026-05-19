# System Overview
The Nearby Business Feasibility & Location Intelligence Platform is built with the stack outlined in `docs/technical-specification.md`: Next.js (App Router) for UI/API, Prisma + Supabase with PostGIS for data, NextAuth for auth, Google Maps/Places for location intelligence, OpenAI GPT-4o Mini for narrative, and Vercel for deployment.

Components:
- **Frontend**: Next.js pages for auth, report creation, dashboard, report detail, PDF download.
- **API Layer**: `/api/v1/reports`, `/api/v1/reports/[id]`, `/api/v1/reports/[id]/pdf`, etc., each protected by NextAuth middleware.
- **Services**: LocationService (maps/geocoding), ScoringService (competition/demand), AIService (GPT summarization), PDFService (`@react-pdf/renderer`).
- **Data**: PostGIS-enabled Postgres with tables for reports, POIs, scoring metadata.

Monitoring: Log API errors, status transitions, AI failures. Document costs in `docs/external-setup-guide.md`.

Traceability: Each flow must map back to `docs/qa-user-flows.md` for QA verification, linking statuses and error handling.
