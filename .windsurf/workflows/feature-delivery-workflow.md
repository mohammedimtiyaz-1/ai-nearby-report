# Feature Delivery Workflow
1. 📌 Intake – Product/PM writes feature summary referencing `docs/product/feature-roadmap.md` and ties it to MVP flows from `docs/qa-user-flows.md`. (Project Manager Skill)
2. 🧠 Design & Tech – Frontend/back teams review `docs/design-specifications.md` and `docs/architecture/technical-architecture.md` for UI and API expectations. (Frontend Skill, Backend Skill, Senior Architect Skill)
3. 🧪 Implementation – Backend adds API routes (reports, scoring, AI) while frontend builds the views, each using schema validation and status transitions defined in the QA doc. (Frontend Skill, Backend Skill)
4. 🔁 Review – QA runs the QA verification workflow (see `qa-verification-workflow.md`) covering happy/error states; architecture lead checks `docs/architecture/scoring-engine.md`. (QA Skill, Senior Architect Skill)
5. 🚀 Merge – Update `docs/planning/implementation-plan.md` with results and commit the feature, pointing to an ADR if any architectural change occurred. (Project Manager Skill, Backend/Frontend Skill)
6. ✅ Close – PM confirms documentation updates in `docs/product/user-journeys.md` and marks the issue as done. (Project Manager Skill)
