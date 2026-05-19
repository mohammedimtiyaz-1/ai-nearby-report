# QA User Flow Library
This document captures every user journey, UI expectation, and validation path for the Nearby Report MVP so QA can verify implementation continuity before development progresses further.

## 1. Personas in Scope
- **First-time business owner**: Needs a simple onboarding and report creation workflow with clear scores and validation clues.
- **Small business consultant**: Will create multiple reports, rely on report history, and expect professional PDFs.
- **Future personas (franchise buyer, broker)**: Architecture should not block future flows but MVP focuses on the two personas above.

## 2. Flow Categories
| Flow Group | Core Actions | Success Criteria | Failure/Error States |
| --- | --- | --- | --- |
| Authentication | Register, sign in, session validation, protected APIs | Session created, tokens stored, middleware rejects unauthorized requests | Duplicate email, invalid credentials, missing hash secret, session expiry, API route returns 401 |
| Report Lifecycle | Create → classify/score → AI summary → dashboard → PDF download | Report progression through statuses, scores populated, PDF generated, dashboard list updated | Validation errors, missing POIs, scoring API failure, OpenAI timeout, PDF generation failure |
| Location & Data | Location search, POI fetching, category normalization, demand signal detection | Geocode success, POIs stored, normalized categories in DB | Google API rate limit, invalid API key, missing radius, zero POIs, network failure |
| Frontend UX | Loading states for API calls, error displays, form validation, error boundary | Spinner/skeleton shown during fetch, friendly error banners, forms prevent invalid submit | Race conditions, stale data, unhandled exceptions, form submission blocked on invalid input |
| Admin/Config | Env var validation, secrets, deployment | Startup fails loudly when var missing, NextAuth secret valid, CORS enforced | Missing `NEXTAUTH_SECRET`, invalid database URL, CORS block, supabase down |

## 3. Flow Details
### 3.1 Authentication Flow (Register → Login → Protected Routes)
1. **Preconditions**: `.env` contains `NEXTAUTH_SECRET`, valid `DATABASE_URL`, and bcryptjs installed.
2. **Success path**:
   - User visits `/register` → enters email + password (>=8 chars) + optional name.
   - Frontend runs Zod validation → shows inline error for invalid email or short password.
   - On submit, API route hashes password with `bcryptjs.hash(password, 10)` and stores User record.
   - Response returns session object; React updates auth store; redirect to `/dashboard`.
   - Login uses `bcryptjs.compare()`, generates session via NextAuth, and issues secure cookie.
   - Any request to `/api/v1/*` passes through middleware; `req.nextauth.session()` ensures userId.
3. **Variants**:
   - Duplicate email → API returns 409 with friendly message.
   - Invalid password → registration blocked with message ("Password must be at least 8 characters").
   - Missing `NEXTAUTH_SECRET` or `DATABASE_URL` → app fails to start; log instructs to populate env.
   - Session expires → NextAuth redirects to login.
4. **Verification**:
   - Register, login, revisit dashboard; unauthorized API call returns 401.
   - Attempt ingestion of invalid email, verify validation message and focus.
   - Remove `NEXTAUTH_SECRET` in local env; app should log error and refuse to run (QA must confirm validation file). 

### 3.2 Report Creation Flow
1. **Preconditions**: Authenticated user, categories seeded, Google Maps/Places keys valid.
2. **UI steps**:
   - Navigate to `/reports/new`.
   - Select business category (Cafe/Pharmacy/Salon). Verify dropdown loads via `GET /api/v1/business-categories` (loading spinner shows, fallback message on failure).
   - Choose business model (category-specific options). 
   - Enter address → typed search triggers debounced call to `/api/v1/locations/search` with query and optional `region`. Show loading indicator while fetching.
   - Choose radius (500m, 1km, 2km, 3km) via dropdown.
   - Optional financial inputs (rent, shop size, setup budget, staff cost, inventory cost, investment range) appear but can be skipped.
   - Form uses react-hook-form + Zod schema to prevent empty category/location/radius. Errors displayed below each field.
   - On submit, display global loading spinner plus progress indicator status ("Collecting data...").
3. **Backend steps**:
   - `/api/v1/reports` POST validates inputs, creates DRAFT report, returns ID.
   - `ReportService.generateReport()` invoked synchronously; statuses progress: COLLECTING_DATA → CLASSIFYING → SCORING → GENERATING_SUMMARY → COMPLETED.
   - LocationService fetches geocode, stores lat/lng, and sets `formattedAddress`.
   - Google Places data fetched for competitors and demand signals; POIs normalized & stored (ReportPOI). If no POIs, mark `missingData` array.
   - ClassificationService tags POIs by type/threat.
   - ScoringService computes competition, demand, accessibility, area fit, financial pressure (when inputs provided) with clamp 0-100; ScoreParameters stored (with explanation). Confidence score derived from POI count + data completeness.
   - AIService (`gpt-4o-mini`) consumes structured data to produce summary sections; cost tracked; fallback message if API fails (stored warning state `COMPLETED_WITH_WARNINGS`).
4. **Variants/failure states**:
   - Google API returns error → catch, show toast "Location search temporarily unavailable" plus Option: retry button.
   - No POIs → display warning beneath results and continue with `missingData` flagged.
   - Scoring error → log, update report status to `COMPLETED_WITH_WARNINGS`, show message "Scores could not be calculated; please try again." 
   - OpenAI timeout → store message in `aiSummary` with fallback content "AI service timed out; manual summary recommended".
   - PDF generation failure (if `@react-pdf/renderer` throws) → fallback to plain-text download; show alert.
5. **Verification**:
   - Create report with valid inputs → status transitions, scoreboard visible, AI summary present.
   - Submit invalid form (missing location) → form rejects and displays message.
   - Trigger API failure (simulate 503) → UI shows error; report status reflects warning.
   - Submit minimal inputs (skip financial) → financial score omitted but report explains manual validation required in summary.

### 3.3 Report Viewing & Dashboard Flow
1. **Dashboard**:
   - `/dashboard` fetches `/api/v1/reports?limit=10&offset=0` with pagination.
   - Loading spinner while request in progress; friendly error card if request fails.
   - Cards show business type, location, final score, status, generated date; each card links to `/reports/[id]`.
   - Pagination controls appear if count > limit.
2. **Report Details**:
   - Loading skeleton while `/api/v1/reports/[id]` fetches report.
   - Display sections: report header (category, score, status), score tiles (competition, demand, accessibility, area fit, financial pressure, confidence), competitor table (name, type, distance, threat level), demand signals list, AI summary (exec summary, opportunities, risks, recommendation), survey checklist, PDF download button.
   - Survey checklist shows manual tasks; marks completed items (if any). If survey data missing, displays placeholder with CTA "Add manual confirmation".
   - Loading indicator on Download PDF action; fallback message if PDF endpoint returns error.
3. **Variants**:
   - Report not found → show 404 message with CTA to dashboard.
   - Unauthorized access → middleware returns 403/401; UI shows "Access denied".
   - API error → show error alert with "Retry" button.
4. **Verification**:
   - View new report, confirm sections populate, scoreboard matches DB.
   - Trigger API error by deleting report (server returns 404) and verify user sees friendly message.
   - Download PDF; handle network failure gracefully.

### 3.4 Report Pipeline Status & Notifications
- Reports move through statuses tracked in DB; each API call updates status field. QA verifies:
  1. `COLLECTING_DATA`: After POST, before classification.
  2. `CLASSIFYING`: While classification service runs.
  3. `SCORING`: During scoring calculations.
  4. `GENERATING_SUMMARY`: During AI call.
  5. `COMPLETED` / `COMPLETED_WITH_WARNINGS`: Final states.
- Dashboard and detail page show badges for statuses.
- In-progress operations show progress indicator (spinner + descriptive text).
- Timeout handling: report generation aborts after 45s, sets warning message.

### 3.5 PDF Export Flow
- `/api/v1/reports/[id]/pdf` generates PDF via `@react-pdf/renderer`.
- Request includes auth; service builds document from `Report` data.
- Success response returns `application/pdf` stream or signed URL.
- Failure handling: send 500 with message "PDF generation failed"; frontend shows error and suggests retry later.

### 3.6 Error & Recovery Paths
| Failure | Expected Behavior | QA Check |
| --- | --- | --- |
| Missing env var (GOOGLE_MAPS_API_KEY, DATABASE_URL, NEXTAUTH_SECRET) | App refuses to start, log outputs friendly guidance, deployment fails fast | Remove var temporarily, start app, confirm error message
| API rate limit hit | Frontend shows "Service unavailable" toast, backend retries once with exponential backoff (if implemented) | Simulate blocked response (429) and verify toast + log entry
| OpenAI cost threshold reached | Log warning, show UI badge "AI cost limit" in admin (future) | Simulate invalid API key or blocked model, confirm fallback summary message
| Supabase outage | API responds 503, UI displays "Database unavailable" with retry | Mock DB connection failure (set invalid connection string); verify 503 response and UI message
| Authentication middleware missing | API responds 401 for anonymous, visible in logs | Call `/api/v1/reports` without cookie; expect 401

## 4. QA Checklist for Flow Approval
1. Verify onboarding validations (Zod/React Hook Form) for every field.
2. Confirm all API routes include authentication middleware and proper pagination.
3. Ensure environmental validations (lib/config/env) run at startup.
4. Validate status transitions and progress indicators show on UI.
5. Verify error states for each major API (location, places, scoring, OpenAI, PDF) display friendly messages.
6. Check survey checklist is shown in dashboard and PDF.
7. Confirm loading states/spinners appear whenever data is fetched.
8. Validate PDF download path and fallback.
9. Ensure optional financial inputs are handled gracefully (scores skip but report warns).
10. Test offline scenarios (network failure) and ensure UI prompts user to retry.

## 5. Traceability Back to Requirements
- **SRS FR-001 to FR-022**: Each flow maps back to requirements (selection, report creation, scoring, AI summary, PDF export, user accounts).
- **Technical spec**: Details about services (LocationService, ScoringService, AIService, PDFService) provide reference implementations for each flow step.

## 6. Next Steps for Development Progress
1. Use this document as QA acceptance criteria before marking features complete.
2. Update `development-progress.md` with any missing steps uncovered during flow analysis (business model selection, optional financial inputs, confidence score, survey checklist, error states).
3. Keep QA flow document versioned and referenced during sprint demos.

---
**Document status**: Draft 1.0 | **Updated**: 2026-05-18 | **Author**: QA Architect
