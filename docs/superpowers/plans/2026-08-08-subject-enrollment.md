# Subject-Level Course Enrollment & Grade Recap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor Course Enrollment System to Subject (Mata Pelajaran) level (`informatika` and `rpl_web_sql`), consolidating module grade recaps and single-code subject unlocks across Student Dashboard (`/dashboard`) and Catalog (`/belajar`).

**Architecture:** Update `scripts/migrate.js` for subject-level enrollment seeding, update POST API endpoint `/api/courses/enroll.ts` to validate subject codes, update `src/pages/dashboard.astro` to render subject-level grade recap cards with averages, and update `src/pages/belajar/index.astro`.

**Tech Stack:** Astro v4 (SSR), Neon Postgres, HTML5, Vanilla CSS, TypeScript.

---

### Task 1: Migration Seeding & Subject Enroll API Endpoint

**Files:**
- Modify: `scripts/migrate.js`
- Modify: `src/pages/api/courses/enroll.ts`

- [ ] **Step 1: Update scripts/migrate.js to seed subject-level enrollments**
  Auto-seed `informatika` for students with LKPD BK/TIK submissions, and `rpl_web_sql` for students with SQL progress. Run `npx tsx scripts/migrate.js`.

- [ ] **Step 2: Update src/pages/api/courses/enroll.ts**
  Validate subject IDs (`informatika`, `rpl_web_sql`, `pbo`). Accept subject access codes:
  - `informatika`: `INFORMATIKA2026`, `INF2026`, `BK2026`, `TIK2026`
  - `rpl_web_sql`: `RPL2026`, `BASISDATA2026`, `SQL2026`
  - `pbo`: `PBO2026`
  Insert `(user_id, subjectId)` into `course_enrollments`.

- [ ] **Step 3: Verify with astro check**
  Run: `npx astro check`

- [ ] **Step 4: Commit**
  Run: `git add scripts/migrate.js src/pages/api/courses/enroll.ts && git commit -m "feat: refactor course enroll API to subject-level validation"`

---

### Task 2: Student Dashboard Subject Grade Recap UI (`src/pages/dashboard.astro`)

**Files:**
- Modify: `src/pages/dashboard.astro`

- [ ] **Step 1: Query subject enrollments & calculate Subject Grade Averages**
  Query `course_enrollments` for `informatika` and `rpl_web_sql`. Calculate average grade for Informatika from BK & TIK scores.

- [ ] **Step 2: Render Subject-Level Grade Recap Cards**
  Render 2 primary Subject Cards:
  1. **Mata Pelajaran Informatika SMK (Fase E)**: LKPD BK score, LKPD TIK score, Average Grade, and Teacher Notes.
  2. **Mata Pelajaran Pemrograman Web & Basis Data (RPL)**: 40 SQL Modules progress, Rank Title, Certificate status.
  For un-enrolled subjects, render locked card with `🔒 Enroll Mata Pelajaran Ini` button.

- [ ] **Step 3: Update Access Code Modal for Subject Enrollment**
  Update modal text and inputs to specify "Mata Pelajaran".

- [ ] **Step 4: Verify with astro check & npm run build**
  Run: `npx astro check && npm run build`

- [ ] **Step 5: Commit**
  Run: `git add src/pages/dashboard.astro && git commit -m "feat: refactor student dashboard to subject-level grade recap cards with grade averages"`

---

### Task 3: Catalog Page Subject Enrollment (`src/pages/belajar/index.astro`)

**Files:**
- Modify: `src/pages/belajar/index.astro`

- [ ] **Step 1: Update Catalog Page Cards for Subject Enrollment**
  Group learning modules under Subject Cards (`Informatika SMK` & `Pemrograman Web & Basis Data`). Display `✓ TERDAFTAR MATA PELAJARAN` badge when enrolled, unlocking all child modules.

- [ ] **Step 2: Verify with astro check & npm run build**
  Run: `npx astro check && npm run build`

- [ ] **Step 3: Commit**
  Run: `git add src/pages/belajar/index.astro && git commit -m "feat: refactor learning catalog page to subject-level course enrollment"`
