# Task 2 Brief: Database Client & Migration Schema

**Files:**
- Create: `src/lib/db.ts`
- Create: `scripts/migrate.js`

**Interfaces:**
- Consumes: Environment variables / Vercel Postgres connection
- Produces: Postgres client helper and schema migration script

## Requirements:
1. Create `src/lib/db.ts`:
   - Export `createPool` instance from `@vercel/postgres` or fallback connection string.
   - Export `query(text, params)` helper function releasing client cleanly.
2. Create `scripts/migrate.js`:
   - Executable NodeJS script creating `users`, `sessions`, `sql_lessons`, and `user_progress` tables if not exist.
3. Verify types and build with `npx astro check`.
4. Commit changes with message `feat: add db client helper and SQL platform migration script`.
5. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-2-report.md`.
