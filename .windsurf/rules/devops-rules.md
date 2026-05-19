# DevOps Rules
1. Source control must keep docs and configs inline with the Windsurf workflows; every release must reference the QA or deployment workflow that finalized it.
2. Use Supabase-managed Postgres with connection pooling; the connection string is stored in `secret-dont-git.txt` and referenced via environment validation at runtime.
3. Deploy to Vercel; store environment variables (Supabase, NextAuth, Google keys, OpenAI) securely in the Vercel dashboard and reference them in `docs/external-setup-guide.md`.
4. Monitor Google API and OpenAI usage via cost alerts; documentation should capture monthly estimates and retention policies.
5. Configure CI/CD to run linting/formatting, tests, and the QA verification workflow before merging code.
6. Track architecture changes with `.windsurf/workflows/architecture-review-workflow.md` and ensure operations run before hitting main environment.
