# 40-Module W3Schools Interactive SQL Curriculum Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the interactive SQL learning platform into a 40-module W3Schools-aligned curriculum across 5 Learning Paths with dual-mode evaluation (data and DDL schema matching) and path-based progress tracking.

**Architecture:** Extend `SQLLesson` schema with `path_id` and `evaluator_type`. Upgrade `sqlEvaluator.ts` to inspect DDL schema structures (`PRAGMA table_info`, `sqlite_master`). Enhance `/belajar/sql` catalog with 5 Learning Path progress cards and level filters. Update `/dashboard` with multi-path analytics and 4-tier rank badges.

**Tech Stack:** Astro v4 (SSR mode), `@astrojs/vercel`, Neon Serverless Postgres, `sql.js` WASM sandbox, CodeMirror 6, TypeScript, Vanilla CSS design system.

## Global Constraints

- **Language**: Indonesian for UI copy, lesson titles, instructions, and theory.
- **Build Verification**: Every task MUST pass `npx astro check` with 0 errors and 0 warnings.
- **Data Resilience**: Support Neon Postgres when connected, with pure-JS memory fallback.

---

### Task 1: Seed Curriculum Data Expansion (seedLessons.ts & migrate.js)

**Files:**
- Modify: `src/lib/seedLessons.ts`
- Modify: `scripts/migrate.js`
- Modify: `src/lib/db.ts`

**Interfaces:**
- Consumes: `SQLLesson` interface
- Produces: 40 populated SQL lessons across 5 Learning Paths (`basics`, `aggregates`, `joins`, `grouping`, `ddl_security`)

- [ ] **Step 1: Update `SQLLesson` interface in `src/lib/seedLessons.ts`**

Add `path_id` and `evaluator_type` properties to `SQLLesson` interface.

- [ ] **Step 2: Populate 40 SQL lessons in `src/lib/seedLessons.ts`**

Add all 40 lessons spanning Level 1 to Level 5 with complete metadata, theory markdown, instructions, seed SQL, expected SQL, and initial code.

- [ ] **Step 3: Update `scripts/migrate.js` & `src/lib/db.ts`**

Add `path_id` and `evaluator_type` columns to `sql_lessons` table definition and update upsert logic.

- [ ] **Step 4: Execute migration script**

Run: `npx tsx scripts/migrate.js`
Expected: `Migrations and lesson seeding completed successfully on Neon Postgres!`

- [ ] **Step 5: Verify build**

Run: `npx astro check`
Expected: 0 errors, 0 warnings

- [ ] **Step 6: Commit**

```bash
git add src/lib/seedLessons.ts scripts/migrate.js src/lib/db.ts
git commit -m "feat: expand curriculum seed data to 40 W3Schools SQL lessons"
```

---

### Task 2: Dual-Mode Evaluator Sandbox Expansion (sqlEvaluator.ts)

**Files:**
- Modify: `src/lib/sqlEvaluator.ts`
- Modify: `src/pages/api/sql/evaluate.ts`

**Interfaces:**
- Consumes: `evaluator_type` from `SQLLesson`
- Produces: `evaluateSolution()` handling both `data_match` and `schema_match` (DDL inspection via SQLite PRAGMA)

- [ ] **Step 1: Implement `evaluateSchema()` in `src/lib/sqlEvaluator.ts`**

Add DDL schema validation that inspects `PRAGMA table_info(tableName)` or `sqlite_master` to verify tables, columns, primary keys, and views created by students.

- [ ] **Step 2: Update `evaluateSolution()` in `src/lib/sqlEvaluator.ts`**

Branch evaluation logic based on `evaluator_type` (`data_match` vs `schema_match`).

- [ ] **Step 3: Update `/api/sql/evaluate.ts`**

Pass `evaluatorType` to `evaluateSolution()`.

- [ ] **Step 4: Verify build**

Run: `npx astro check`
Expected: 0 errors, 0 warnings

- [ ] **Step 5: Commit**

```bash
git add src/lib/sqlEvaluator.ts src/pages/api/sql/evaluate.ts
git commit -m "feat: add DDL schema_match evaluation support to SQL evaluator"
```

---

### Task 3: Categorized Catalog UI & Learning Paths Filtering (/belajar/sql/index.astro)

**Files:**
- Modify: `src/pages/belajar/sql/index.astro`

**Interfaces:**
- Consumes: `seedLessons`, `user_progress`
- Produces: Categorized catalog UI grouped into 5 Learning Paths with interactive filter tabs and path progress indicators.

- [ ] **Step 1: Update `/belajar/sql/index.astro`**

Add 5 Learning Path progress cards and category filter tabs (`Semua`, `Basics`, `Aggregates`, `Joins`, `Grouping`, `DDL & Security`).

- [ ] **Step 2: Verify build**

Run: `npx astro check`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add src/pages/belajar/sql/index.astro
git commit -m "feat: enhance SQL catalog page with 5 Learning Path sections and level filters"
```

---

### Task 4: Interactive Workspace & Next Module Navigation (/belajar/sql/[slug].astro)

**Files:**
- Modify: `src/pages/belajar/sql/[slug].astro`

**Interfaces:**
- Consumes: `SQLLesson`, `/api/sql/evaluate`
- Produces: Interactive split-screen workspace supporting DDL execution and path-aware next lesson navigation.

- [ ] **Step 1: Update `/belajar/sql/[slug].astro`**

Update workspace script to send `evaluatorType` and handle DDL feedback banners cleanly.

- [ ] **Step 2: Verify build**

Run: `npx astro check`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add src/pages/belajar/sql/[slug].astro
git commit -m "feat: update workspace for DDL exercises and path navigation"
```

---

### Task 5: Enhanced Student Dashboard (/dashboard.astro)

**Files:**
- Modify: `src/pages/dashboard.astro`

**Interfaces:**
- Consumes: `user_progress`, `sql_lessons`
- Produces: Dashboard showing progress breakdown across the 5 Learning Paths and 4-tier rank badges.

- [ ] **Step 1: Update `/dashboard.astro`**

Add path-level progress bars and 4 rank badges (SQL Novice, Intermediate, Advanced, Master SQL Engineer).

- [ ] **Step 2: Verify build**

Run: `npx astro check`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard.astro
git commit -m "feat: enhance student dashboard with multi-path analytics and 4-tier rank badges"
```

---

### Task 6: Final Verification & Production Deployment

**Files:**
- All repository files

- [ ] **Step 1: Full build verification**

Run: `npx astro check && npm run build`
Expected: 0 errors, 0 warnings, build complete

- [ ] **Step 2: Push to GitHub & deploy to Vercel**

Run: `git push origin main && vercel deploy --prod --yes`
Expected: Production deployment URL ready

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore: verify production deployment for 40-module SQL curriculum"
```
