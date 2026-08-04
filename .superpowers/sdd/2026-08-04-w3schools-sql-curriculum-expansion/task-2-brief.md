# Task 2 Brief: Dual-Mode Evaluator Sandbox Expansion (sqlEvaluator.ts & API)

**Files:**
- Modify: `src/lib/sqlEvaluator.ts`
- Modify: `src/pages/api/sql/evaluate.ts`

**Interfaces:**
- Consumes: `evaluator_type` from `SQLLesson`
- Produces: `evaluateSolution()` handling both `data_match` and `schema_match` (DDL inspection via SQLite PRAGMA / sqlite_master)

## Requirements:
1. Update `src/lib/sqlEvaluator.ts`:
   - Implement `evaluateSchema()` to validate DDL exercises (`CREATE TABLE`, `ALTER TABLE`, `CREATE VIEW`).
   - For `schema_match` evaluator type, execute student's SQL and inspect `sqlite_master` or `PRAGMA table_info()` / `PRAGMA index_list()` to verify tables, columns, constraints, or views match expected definitions.
   - Update `evaluateSolution()` to branch on `evaluatorType` (`'data_match'` | `'schema_match'`).
2. Update `src/pages/api/sql/evaluate.ts`:
   - Fetch `evaluator_type` from `sql_lessons` DB table if `lessonId` is provided.
   - Pass `evaluatorType` to `evaluateSolution()`.
3. Verify with `npx astro check`.
4. Commit changes with message `feat: add DDL schema_match evaluation support to SQL evaluator`.
5. Write report file to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-w3schools-sql-curriculum-expansion/task-2-report.md`.
