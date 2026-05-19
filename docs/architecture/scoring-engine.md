# Scoring Engine
The scoring engine computes:
- Competition Score: Based on POI density and threat level.
- Demand Score: Derived from demand signal strength/count.
- Accessibility Score: Weighted by transport nodes, ingress/egress.
- Area Fit Score: Matches business model to neighborhood traits.
- Financial Pressure Score: Optional; uses user input for rent, shop size, budget.
- Confidence Score: Aggregates data completeness, API response quality.

Store reasoning for each score in the `ScoreCard` table and expose it via the report API endpoints. Document formulas and fallback thresholds in this doc and align them with AI prompts described in `docs/architecture/ai-report-generation.md`.
