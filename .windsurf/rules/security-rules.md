# Security Rules
1. Encrypt sensitive connection strings via Supabase-managed secrets and keep API keys only in `secret-dont-git.txt`; do not commit them. Document this policy here and refer to the external setup doc for manual configuration.
2. Add NextAuth session-based CSRF protection and bcrypt-hashed passwords according to the technical spec; audit the auth flows every sprint to match QA expectations.
3. Whitelist API origins and restrict Google API keys to the Next.js domain (per external setup guide).
4. Validate user input to guard against injection attacks and leak prevention while storing only hashed data when needed.
5. Use environment variable validation on startup; any missing secret should cause the build to fail fast before passing `next build`.
6. Maintain a security log for breached data sources, referencing the QA flow grid for failure handling and the doc `security-observability-accessibility.md` once created.
