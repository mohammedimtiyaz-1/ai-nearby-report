# Deployment Checklist
1. Environment variables (Supabase URL + password, Google API keys, OpenAI key, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL) are set in Vercel/local `.env`.
2. Linting and formatting pass.
3. QA verification workflow run and passed.
4. Architecture review workflow run for any scoring/AI changes.
5. Deployment workflow executed (`build`, `export` if needed).
6. Post-deploy smoke tests on dashboard, report detail, and PDF endpoints.
7. Monitor Google/OpenAI cost usage; document in `docs/external-setup-guide.md` if thresholds shift.
8. Update release notes linking to relevant product and QA docs.
