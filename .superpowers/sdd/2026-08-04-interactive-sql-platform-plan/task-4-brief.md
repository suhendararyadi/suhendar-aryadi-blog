# Task 4 Brief: Interactive SQL Evaluator Backend (lib/sqlEvaluator.ts & API)

**Files:**
- Create: `src/lib/sqlEvaluator.ts`
- Create: `src/pages/api/sql/execute.ts`
- Create: `src/pages/api/sql/evaluate.ts`

**Interfaces:**
- Consumes: `sql.js` WASM / in-memory SQLite sandbox
- Produces: Query execution results and solution validation logic

## Requirements:
1. Create `src/lib/sqlEvaluator.ts`:
   - Initialize `sql.js` in-memory database per request.
   - Run `seed_sql` and `user_sql` returning `{ columns, values, error }`.
   - Implement `evaluateSolution(seedSql, expectedSql, userSql)` comparing columns and row values between expected query result and student's query result.
2. Create API endpoints:
   - `src/pages/api/sql/execute.ts`: POST endpoint running query and returning JSON result.
   - `src/pages/api/sql/evaluate.ts`: POST endpoint evaluating solution, checking session cookie, and recording completion into `user_progress` table in Vercel Postgres if passed.
3. Verify with `npx astro check` and `npm run build`.
4. Commit changes with message `feat: add interactive SQL execution and evaluation API`.
5. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-4-report.md`.
