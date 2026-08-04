# Task 6 Brief: Interactive Workspace & Catalog Pages (/belajar/sql/ & /dashboard)

**Files:**
- Create: `src/pages/belajar/sql/index.astro`
- Create: `src/pages/belajar/sql/[slug].astro`
- Create: `src/pages/dashboard.astro`

**Interfaces:**
- Consumes: `getSessionUser()`, `sql_lessons`, `user_progress`
- Produces: FreeCodeCamp-style interactive split-screen workspace, catalog page, and user progress dashboard

## Requirements:
1. Create `src/pages/belajar/sql/index.astro`:
   - Interactive SQL Curriculum Catalog.
   - Header banner with student login status indicator.
   - Grid listing all 5 seed SQL lessons with category badges, titles, and CTA link.
2. Create `src/pages/belajar/sql/[slug].astro`:
   - FreeCodeCamp-style split-screen workspace (Left: Theory & Task Instructions; Right: SQL Code Editor & Result Table + Evaluation Banner).
   - "Run Query" button triggering `/api/sql/execute`.
   - "Submit Answer" button triggering `/api/sql/evaluate` and showing PASS/FAIL banner with next lesson unlocking.
3. Create `src/pages/dashboard.astro`:
   - Student Dashboard displaying user profile, progress stats, completed modules, and logout button.
4. Verify with `npx astro check` and `npm run build`.
5. Commit changes with message `feat: implement FreeCodeCamp interactive SQL catalog, split-screen workspace, and student dashboard`.
6. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-6-report.md`.
