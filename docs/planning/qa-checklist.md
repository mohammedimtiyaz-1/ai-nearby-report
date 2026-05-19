# QA Checklist
Use this checklist for every release; tie each item to QA user flows.
1. Authentication flows (register, login, session persistence) work and handle invalid inputs.
2. Report creation: validation, business model selection, location search, radius selection, optional financial input handling.
3. Report pipeline statuses (COLLECTING, CLASSIFYING, SCORING, AI, COMPLETED) update in UI.
4. Dashboard listing and pagination work; cards link to detail view.
5. Report detail: competitor table, demand signals, scoring tiles, AI summary, survey checklist, PDF download.
6. Error handling: API failures (OpenAI, Google, Supabase) show friendly toasts and allow retry.
7. Survey checklist interactions; manual completion persists.
8. Load states: skeletons/spinners appear during fetching.
9. Accessibility/performance answers from design spec.
10. Security: env vars validated, unauthorized API access returns 401.
11. Observability: monitor logs for AI/timeouts, rate limits as noted in architecture docs.
12. Cost monitoring: verify thresholds per `docs/external-setup-guide.md`.
