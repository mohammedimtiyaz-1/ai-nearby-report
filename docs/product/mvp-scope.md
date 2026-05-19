# MVP Scope
The MVP focuses on delivering a complete Nearby Business Feasibility & Location Intelligence Platform flow for Cafe, Pharmacy, and Salon owners/consultants. Each story should tie to the QA user flows and be verifiable via the QA checklist.

## Included
- Business type selection, location search, radius choice, optional financial/business context inputs.
- Location intelligence collection using Google Maps/Places per `docs/external-setup-guide.md`.
- Classification of competitors and demand signals with scoring stored in `docs/architecture/scoring-engine.md`.
- AI report summary (GPT-4o Mini) stored via `docs/architecture/ai-report-generation.md`.
- Dashboard listing, detail view, and PDF export (reports + survey checklist) with statuses per QA flows.
- Manual survey checklist for physical validation supervision.
- Environment setups (Supabase, NextAuth, Vercel) documented and validated before release.

## Out of Scope for MVP
a. Multi-location comparison
b. Sentiment analysis or custom review ingestion
c. Full financial projections or revenue guarantees
d. Franchise/b2b dashboards

## Future Phases (link to product roadmap)
Additions for future phases include multi-location comparison, consultant tools, and reverse recommendation flows (per initial prompt). These will have dedicated sections in `docs/product/feature-roadmap.md`. Ensure future coverage includes QA flows for new user journeys.
