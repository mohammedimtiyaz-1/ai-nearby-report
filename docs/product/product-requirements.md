# Product Requirements
The Nearby Business Feasibility & Location Intelligence Platform delivers a decision-support workflow for evaluating shop locations across three MVP business types (Cafe, Pharmacy, Salon). This doc references the QA flow library (`docs/qa-user-flows.md`) to ensure every requirement links to an end-to-end journey.

## Core MVP Requirements
1. **Select business profile** – Users must choose a business category, optional business model, budget, rent, shop size, and location radius before analysis begins (`docs/qa-user-flows.md` steps 3.1 & 3.2).
2. **Collect location intelligence** – System calls Google Maps/Places (see `docs/external-setup-guide.md`) to gather POIs, demand signals, and accessibility markers, mapping them into the data model defined in `docs/architecture/data-model.md`.
3. **Segment competitors & demand** – Classification service identifies direct/indirect competition, demand signals, and risk factors; results feed scoring described in `docs/architecture/scoring-engine.md`.
4. **Compute explainable scores** – Each report stores competition, demand, accessibility, area fit, financial pressure, and confidence scores with reasoning, as required by QA flows and architecture docs.
5. **Generate AI narrative** – GPT-4o Mini produces executive summary, opportunities, risks, and final recommendation; store results in AI report doc (`docs/architecture/ai-report-generation.md`).
6. **Deliver dashboard + PDF** – Users view aggregated reports, download PDF exports, and see survey checklists flagged for manual validation (flows 3.3, 3.5).
7. **Operate ethically** – The platform remains a decision-support engine and explicitly avoids guaranteeing revenue or exact footfall (product boundary from prompt). All messaging must reinforce this limitation.

## Constraints & Non-functional Requirements
- **Timeliness**: Report generation pipeline must complete within 45 seconds (technical spec success criteria).
- **Security**: Secrets live in `secret-dont-git.txt`; environment validation occurs before startup (see `.windsurf/rules/security-rules.md`).
- **QA coverage**: Every release must reference `docs/planning/qa-checklist.md` and the QA workflows to ensure thorough testing.
- **Deployable architecture**: Hosted on Vercel, Supabase/Postgres handles data, OpenAI handles AI summaries.

## Traceability
- Requirements trace to `docs/technical-specification.md` sections and `docs/qa-user-flows.md` journeys.
- Changes in scope require ADRs documented in `docs/decisions/adr-template.md`.
- Use this doc when aligning product stories with phase planning (`docs/planning/phases-and-milestones.md`).
