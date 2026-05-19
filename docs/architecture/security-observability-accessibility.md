# Security, Observability, Accessibility
- **Security**: Follow `.windsurf/rules/security-rules.md`, document NextAuth, env validation, and restricted API keys. Mention `secret-dont-git.txt` usage and Vercel secret storage.
- **Observability**: Log API failures, scoping status transitions, and AI errors. Document how to use Supabase logs and Vercel monitoring plus QA flows for verifying dependencies.
- **Accessibility**: Use design tokens (contrast ratios) from `docs/design-specifications.md`, ensure focus states, and verify via QA workflows.
- Tie each observability/security action back to workflows (`.windsurf/workflows/deployment-workflow.md`, `.windsurf/workflows/qa-verification-workflow.md`).
