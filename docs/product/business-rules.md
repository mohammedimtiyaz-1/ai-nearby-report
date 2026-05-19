# Business Rules
1. The platform is advisory only and cannot promise revenue, footfall, or legal advice; all messaging must state this explicitly (per prompt requirement).
2. Users may only input permissible business categories (Cafe, Pharmacy, Salon) during MVP; other categories require future approval.
3. Locations tie to a radius selection (500m-3km) and optional financial/operational context; invalid combos are rejected by validation rules.
4. Reports must display computed confidence scores and highlight missing data, per QA rules for transparency.
5. Survey checklist outcomes are required for manual verification; each item must have completion status.
6. Cost monitoring must alert if Google or OpenAI usage approaches the configured thresholds; document these thresholds in `docs/external-setup-guide.md`.
