# Job Application Tracker

Fullstack Next.js (App Router) + Prisma Postgres app for tracking job applications.
See `docs/` for the PRD and execution runbook, and `docs/ARCHITECTURE_DECISIONS.md`
for canonical decisions where the two source docs disagree.

## Stack
- Next.js 16 (App Router, Server Actions, RSC)
- Auth.js v5 (JWT sessions; dev Credentials provider + optional Google OAuth)
- Prisma ORM 7 + Prisma Postgres (via `@prisma/adapter-pg`)
- Tailwind CSS v4, Zod validation

## Run locally
1. Install deps: `npm install`
2. Copy env: `cp .env.example .env` and fill values. `DATABASE_URL` is already set
   by `prisma postgres link`. Generate a secret: `openssl rand -base64 32` into `AUTH_SECRET`.
3. Generate client + apply migrations: `npm run prisma:generate && npx prisma migrate deploy`
4. Seed sample data (optional): `npm run prisma:seed`
5. Start dev server: `npm run dev` then open http://localhost:3000
6. Sign in on `/login` with any email (dev Credentials provider). Default statuses
   are seeded on first sign-in.

## Useful scripts
- `npm run dev` / `npm run build` / `npm run start`
- `npm run typecheck` — tsc no-emit
- `npm run verify:prisma` — connects and prints row counts
- `npm run prisma:studio` — browse data

## Production notes
- To deploy on Prisma Compute or Docker, set `output: "standalone"` in
  `next.config.ts` and run `node .next/standalone/server.js`.
- Prisma Client must only be imported server-side (`lib/prisma.ts`, `lib/db.ts`).
- All domain queries go through `forUser(userId)` in `lib/db.ts` for tenant isolation.

## Security
- `.env` and `serviceAccountKey.json` are gitignored. Never commit secrets.
- Rotate any credential that was shared in plaintext during setup.
