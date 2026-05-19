# AI Report Generation
- Use OpenAI GPT-4o Mini for generating executive summary, opportunities, risks, and final recommendation.
- Prompt template should ingest structured data (scores, competitor table, demand signals) and include a reminder that this is advisory only.
- Store response sections and metadata in the report record (include model name, timestamp, confidence indicator).
- When the model fails or times out, fall back to a placeholder message and mark the report `COMPLETED_WITH_WARNINGS` in QA flows.
- Track cost per call and log prompts/responses for auditing and debugging; update `docs/external-setup-guide.md` with spending thresholds.
- Align the summary sections with the frontend layout defined in `docs/design-specifications.md`.
