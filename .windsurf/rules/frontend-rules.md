# Frontend Rules
1. Build pages on the Next.js App Router; pair server components (for data fetching) with suspense/ loading states described in `docs/qa-user-flows.md`.
2. Use React Hook Form + Zod for validation so forms mirror the QA flow expectations for business input, location search, radius selection, and optional financial inputs.
3. Implement loading skeletons, error banners, and optimistic UI transitions matching the design system captured in `docs/design-specifications.md`.
4. Keep state management minimal: use server-side props for report listings, `useSWR` for real-time updates, and local state for modals/inputs. Track status chips (COLLECTING, SCORING, COMPLETED) as described in QA flows.
5. Use the design tokens (colors, spacing) in `docs/design-specifications.md` to ensure consistent branding across dashboard, report detail, and auth pages, and link components to QA flows for verification.
6. Document component structure and shared UI elements in `docs/architecture/technical-architecture.md`, referencing the workflows that rely on them (feature delivery, QA verification).
