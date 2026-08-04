# Task 1 Brief: Seed Curriculum Data Expansion (seedLessons.ts, migrate.js, db.ts)

**Files:**
- Modify: `src/lib/seedLessons.ts`
- Modify: `scripts/migrate.js`
- Modify: `src/lib/db.ts`

**Interfaces:**
- Consumes: `SQLLesson` interface
- Produces: 40 populated SQL lessons across 5 Learning Paths (`basics`, `aggregates`, `joins`, `grouping`, `ddl_security`)

## Requirements:
1. Update `SQLLesson` interface in `src/lib/seedLessons.ts`:
   - Add `path_id: 'basics' | 'aggregates' | 'joins' | 'grouping' | 'ddl_security'`
   - Add `evaluator_type: 'data_match' | 'schema_match'`
2. Populate all 40 W3Schools-aligned SQL lessons in `src/lib/seedLessons.ts` with complete metadata, theory markdown, instructions, seed SQL, expected SQL, initial code, `path_id`, and `evaluator_type`.
3. Update `scripts/migrate.js` and `src/lib/db.ts`:
   - Add `path_id` and `evaluator_type` columns to `sql_lessons` table definition and update upsert queries.
4. Execute `npx tsx scripts/migrate.js` to seed the database.
5. Verify with `npx astro check`.
6. Commit changes with message `feat: expand curriculum seed data to 40 W3Schools SQL lessons`.
7. Write report file to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-w3schools-sql-curriculum-expansion/task-1-report.md`.
