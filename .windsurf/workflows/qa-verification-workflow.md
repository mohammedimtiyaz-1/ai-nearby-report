# QA Verification Workflow
1. Align test scenarios with `docs/qa-user-flows.md`, ensuring every step (auth, report creation, dashboard, report detail, PDF, survey checklist) is addressed. (QA Skill)
2. Execute automated/lab tests covering the success, validation, and failure states mentioned in QA rules. (QA Skill)
3. Capture results in `docs/planning/qa-checklist.md`, noting tickets for defects not already described in the QA flows. (QA Skill)
4. Review load, accessibility, and UX metrics against `docs/design-specifications.md` expectations. (Frontend Skill, QA Skill)
5. Log final approval or failure inside the milestone workflow entry and update `docs/product/user-journeys.md` as needed. (Project Manager Skill, QA Skill)
6. If the QA fails, stop the feature delivery workflow and re-run after remediation. (Project Manager Skill, QA Skill)
