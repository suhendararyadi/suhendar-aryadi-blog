# Task 4 Brief: Interactive Workspace & Next Module Navigation (/belajar/sql/[slug].astro)

**Files:**
- Modify: `src/pages/belajar/sql/[slug].astro`

**Interfaces:**
- Consumes: `SQLLesson`, `/api/sql/evaluate`
- Produces: Interactive split-screen workspace supporting DDL execution and path-aware next lesson navigation.

## Requirements:
1. Update `src/pages/belajar/sql/[slug].astro`:
   - Pass `evaluatorType` (`lesson.evaluator_type || 'data_match'`) to `/api/sql/evaluate`.
   - Render badge for evaluator type (`📊 Data Match` vs `📐 Schema Match`) on the workspace header.
   - For DDL schema match exercises, render clear schema feedback (tables/views/columns/constraints verified).
   - Ensure "Modul Selanjutnya" button correctly targets the next lesson in the 40-lesson sequence.
2. Verify with `npx astro check`.
3. Commit changes with message `feat: update workspace for DDL exercises and path navigation`.
4. Write report file to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-w3schools-sql-curriculum-expansion/task-4-report.md`.
