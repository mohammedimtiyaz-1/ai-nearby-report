# Data Model
We leverage Supabase (Postgres + PostGIS) to store:
- **Report**: metadata, business type, location, radius, status, confidence, AI summary IDs.
- **ReportPOI**: competitor/demand records with `geometry` column from PostGIS for spatial queries.
- **ScoreCard**: competition, demand, accessibility, area fit, financial pressure, plus reasoning text.
- **SurveyChecklist**: manual validation tasks and completion status.

Each table should track versioned statuses for `COLLECTING_DATA`, `SCORING`, `AI_GENERATING`, and `COMPLETED` fields to mirror QA flows. Add indexes on `status`, `userId`, and `businessCategoryId` as described in `docs/development-progress.md` updates.
