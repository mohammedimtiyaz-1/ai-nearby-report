# AI Rules
1. Use OpenAI GPT-4o Mini for report summaries; log prompts/responses with rate limits documented in `docs/qa-user-flows.md`.
2. Define prompt templates inside the AI service component and store them in `docs/architecture/ai-report-generation.md` for auditability.
3. Include fallback messaging when the model fails or returns low confidence; surface these failure cues in the UI (QA flows: `COMPLETED_WITH_WARNINGS`).
4. Track API usage/costs and add alerts when spending nears thresholds (per `docs/external-setup-guide.md` cost monitoring section).
5. Store AI-generated sections (executive summary, opportunities, risks, recommendation) in the report record with metadata for validation.
6. Keep AI decisions explainable: pair each score with reasoning written to the scoring metadata table described in `docs/architecture/data-model.md` and `docs/architecture/scoring-engine.md`.
