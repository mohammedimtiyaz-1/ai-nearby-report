# User Journeys
Each journey references `docs/qa-user-flows.md` to ensure QA/UX alignment.

## Journey: New Report Creation
1. Authenticate via NextAuth (documented in `docs/technical-specification.md`).
2. Choose business category (Cafe/Pharmacy/Salon), optional business model, and optional financial inputs; the UI should display helper text from `docs/design-specifications.md`.
3. Search address (debounced) and adjust pin on the map; show spinner while hitting `/api/v1/locations/search`.
4. Submit form, backend validates schema, stores report, and triggers classification, scoring, AI summary, and PDF generation.
5. Dashboard updates with new report card showing status (COLLECTING_DATA, SCORING, COMPLETED).
6. Detail view shows competitor table, demand signals, AI summary, and survey checklist.
7. Save PDF and mark physical survey checklist items per QA flows.

## Journey: Report Review
- Access dashboard, filter by status, paginate (limit/offset), view each card, drill into detail page, download PDF, confirm survey checklist suggestions.
- Handle errors by showing friendly banners/toasts defined in `docs/design-specifications.md` and QA fragments.

## Journey: Admin/QA Review
- Run QA verification workflow; ensure environment variables present; log architecture review comments; cross-reference `docs/planning/qa-checklist.md`.
