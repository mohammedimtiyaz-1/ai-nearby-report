# Global Rules
1. All code, docs, and workflows must reference the MVP context defined in `docs/technical-specification.md` and the paths captured in `docs/qa-user-flows.md` so every decision supports the Nearby Business Feasibility & Location Intelligence Platform story.
2. Default stack: Next.js App Router + TypeScript + React (per the technical spec), Prisma/ Supabase for data, NextAuth for auth, OpenAI GPT-4o Mini for AI summaries, and Vercel for deployment. If any deviation occurs, document the reasoning in an ADR stored in `docs/decisions/adr-template.md`.
3. Always keep secrets local (`secret-dont-git.txt`) and register them via environment variables (`.env.local`, Vercel dashboard) before running the app. The `external-setup-guide.md` lists required services and billing hints.
4. Use the QA flows doc as the source of truth for user journeys, edge cases, and verification criteria before marking features as complete.
5. Every new feature or refactor must be accompanied by tests or QA checklists that cover happy paths + error/failure states documented in the QA flow library.
6. Document analytics, monitoring, and performance decisions in `docs/architecture/system-overview.md` to keep architecture reviews aligned with future scale concerns.
