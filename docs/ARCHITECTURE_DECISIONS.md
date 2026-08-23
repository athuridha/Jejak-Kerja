# Architecture Decision Record — Canonical Resolutions

This file is the single source of truth where `01_PRD_DOCUMENT.md` and
`INSTRUCTIONS.md` disagree. When the two docs conflict, this file wins.

## ADR-1: Canonical data model = INSTRUCTIONS.md
- **Decision:** Use string `cuid` primary keys, camelCase fields, and the
  Auth.js v5 tables (`User`, `Account`, `Session`, `VerificationToken`) plus
  domain models `Company`, `Status`, `Application`.
- **Rejected:** The PRD's integer PKs / snake_case ER diagram. It predates the
  Auth.js adapter requirement and cannot store OAuth account/session rows.
- **Implemented in:** `prisma/schema.prisma`.

## ADR-2: Auth session strategy = database sessions (Prisma adapter)
- **Decision:** Auth.js v5 with `PrismaAdapter` and the `Account`/`Session`
  tables. Session strategy is `database`, not JWT.
- **Rejected:** The PRD's "JWT strategy" note. Mixing the Prisma adapter's
  `Session` table with a JWT strategy is contradictory and breaks the documented
  "seed default statuses on first login" server-side hook.
- **Hook:** On `signIn`/session creation, call `ensureDefaultStatuses(userId)`
  from `lib/data/statuses-default.ts`.

## ADR-3: Data isolation = enforced via a user-scoped data layer
- **Decision:** Application code must not call `prisma` directly for domain
  reads/writes. Use `forUser(userId)` from `lib/db.ts`; every query is bound to
  `userId`. Updates/deletes use `updateMany`/`deleteMany` with a `userId` filter
  so a forged id cannot touch another tenant's row.
- **Note:** This is app-level isolation only (no Postgres RLS). RLS can be added
  later as defense-in-depth without changing the call sites.

## ADR-4: Status ownership = always user-owned
- **Decision:** `Status.userId` is **non-nullable**. Defaults are seeded per user
  on first login (idempotent via `@@unique([name, userId])`). No global/shared
  statuses.
- **Rejected:** The INSTRUCTIONS `userId String?` nullable owner, which allowed
  cross-tenant/global statuses and conflicted with per-user seeding.
- **Implemented in:** `prisma/schema.prisma`, migration
  `20260823145400_status_user_owned`, `lib/data/statuses-default.ts`.

## ADR-5: Database & ORM = Prisma Postgres + Prisma 7 driver adapter
- **Decision:** Host on Prisma Postgres. Prisma 7 requires a driver adapter, so
  `PrismaClient` is constructed with `PrismaPg` (`lib/prisma.ts`), the datasource
  URL lives in `prisma.config.ts` (not `schema.prisma`), and migrations run with
  `prisma migrate dev` locally / `prisma migrate deploy` in CI.
- **Rejected / outdated:** The INSTRUCTIONS `prisma db push` + bare
  `new PrismaClient()` + Vercel Postgres steps. `db push` skips migration history
  and the bare client fails under Prisma 7.

## ADR-6: Secrets handling
- `.env` (holds `DATABASE_URL`) and `serviceAccountKey.json` (Firebase admin) are
  gitignored. `.env.example` documents the shape with placeholders.
- The Firebase service account key and Prisma API key shared during setup were
  exposed in plaintext and **should be rotated**.
