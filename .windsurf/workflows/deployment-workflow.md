# Deployment Workflow
1. Confirm environment variables (Supabase, Google, OpenAI, NextAuth) are documented and available in Vercel per `docs/external-setup-guide.md`. (DevOps Skill)
2. Run linting, tests, QA verification, and architecture review before merging into `main`. (DevOps Skill, QA Skill, Senior Architect Skill)
3. Use Vercel for builds; ensure deployments run the QA/phase workflows for release readiness. (DevOps Skill)
4. After deployment, verify APIs (reports, PDF) and UI flows (dashboard, report detail) using the QA verification workflow and log results. (QA Skill, DevOps Skill)
5. Document release details in `docs/planning/deployment-checklist.md` and link to the relevant feature / milestone workflows. (Project Manager Skill, DevOps Skill)
6. Monitor production costs/usage for Google & OpenAI and update `docs/external-setup-guide.md` if thresholds change. (DevOps Skill)
