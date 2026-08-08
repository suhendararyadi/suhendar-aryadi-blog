# Course Enrollment & Student Grade Recap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Course Enrollment System and Grade Recap Cards on Student Dashboard (`/dashboard`) with auto-enrollment for existing progress and access-code validation for new modules.

**Architecture:** Add `course_enrollments` table via `scripts/migrate.js`, create POST API endpoint `/api/courses/enroll.ts`, update `src/pages/dashboard.astro` to render module grade recap cards and enrollment modal, and update `src/pages/belajar/index.astro` to reflect enrollment badges.

**Tech Stack:** Astro v4 (SSR), Neon Postgres, HTML5, Vanilla CSS, TypeScript.

---

### Task 1: Database Schema Migration & Enroll API Endpoint

**Files:**
- Modify: `scripts/migrate.js`
- Create: `src/pages/api/courses/enroll.ts`

- [ ] **Step 1: Add course_enrollments table to scripts/migrate.js**
  Add SQL table definition and auto-seed logic for users with existing LKPD / SQL progress.

- [ ] **Step 2: Run migration script**
  Run: `npx tsx scripts/migrate.js`

- [ ] **Step 3: Create src/pages/api/courses/enroll.ts**
  Validate session, match access code (`RPL2026`, `INFORMATIKA2026`, or course-specific `BK2026`, `TIK2026`, `SQL2026`, `SK2026`, `AP2026`), and insert into `course_enrollments`.

- [ ] **Step 4: Verify with astro check**
  Run: `npx astro check`

- [ ] **Step 5: Commit**
  Run: `git add scripts/migrate.js src/pages/api/courses/enroll.ts && git commit -m "feat: add course_enrollments table and course enroll API endpoint"`

---

### Task 2: Student Dashboard Grade Recap & Enrollment UI

**Files:**
- Modify: `src/pages/dashboard.astro`

- [ ] **Step 1: Query course_enrollments & student LKPD grades**
  Auto-sync existing student progress to `course_enrollments`. Fetch grades from `lkpd_submissions` and `lkpd_tik_submissions`.

- [ ] **Step 2: Implement Rekap Nilai & Status Modul grid**
  Render cards for 5 modules (`bk`, `tik`, `sql`, `sk`, `ap`). Show score badges, teacher feedback, and enrolled vs locked states.

- [ ] **Step 3: Implement Enroll Access Code Modal & Script**
  Add modal `#enroll-modal` with input field for Access Code, submit handler calling `/api/courses/enroll.ts`.

- [ ] **Step 4: Verify with astro check & npm run build**
  Run: `npx astro check && npm run build`

- [ ] **Step 5: Commit**
  Run: `git add src/pages/dashboard.astro && git commit -m "feat: implement student grade recap and course enrollment UI on dashboard"`

---

### Task 3: Catalog Integration (`src/pages/belajar/index.astro`)

**Files:**
- Modify: `src/pages/belajar/index.astro`

- [ ] **Step 1: Update learning catalog cards with enrollment status**
  Show `TERDAFTAR` vs `BELUM ENROLL` badges and enrollment buttons on catalog page.

- [ ] **Step 2: Verify with astro check & npm run build**
  Run: `npx astro check && npm run build`

- [ ] **Step 3: Commit**
  Run: `git add src/pages/belajar/index.astro && git commit -m "feat: integrate enrollment status badges into course catalog page"`
