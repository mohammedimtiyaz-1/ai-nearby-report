# QA Rules
1. Track every user path from `docs/qa-user-flows.md` and cover both happy/error states in tests or manual QA scripts.
2. Automate smoke tests for core Next.js routes: `/api/v1/reports`, `/reports/new`, `/reports/[id]`, `/dashboard`, `/api/v1/reports/[id]/pdf`.
3. Validate scoring outputs, AI summaries, and survey checklist states against feature specs in `docs/qa-user-flows.md` before approving a release.
4. Use the QA checklist template in `docs/planning/qa-checklist.md` for every sprint; tie each bullet back to the flows described in the QA doc.
5. Run accessibility and performance audits on the dashboard and report detail screens, referencing the design tokens from `docs/design-specifications.md`.
6. Log all failure states (e.g., OpenAI timeout, location search error) and ensure the UI surfaces the appropriate toast as defined in the QA library.
