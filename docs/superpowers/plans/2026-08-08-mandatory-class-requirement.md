# Mandatory Student Class Identity System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce mandatory student class selection across registration, login, session validation (logging out any active user missing a class), and API endpoints.

**Architecture:** Create `/api/auth/update-class.ts`, update `src/pages/api/auth/login.ts` and `src/pages/api/auth/register.ts`, update `src/pages/auth/login.astro` with mandatory class selection modal/step, and update SSR frontmatter in `src/pages/dashboard.astro` and `src/pages/belajar/index.astro` to clear sessions of users without a class.

**Tech Stack:** Astro v4 (SSR), Neon Postgres, HTML5, Vanilla CSS, TypeScript.

---

### Task 1: API Endpoints & Mandatory Class Registration

**Files:**
- Modify: `src/pages/api/auth/register.ts`
- Modify: `src/pages/api/auth/login.ts`
- Create: `src/pages/api/auth/update-class.ts`
- Modify: `src/pages/auth/register.astro`

- [ ] **Step 1: Create src/pages/api/auth/update-class.ts**
  Create POST endpoint accepting `{ userId, className }` or using current session user, updating `users.class_name`.

- [ ] **Step 2: Update src/pages/api/auth/register.ts & register.astro**
  Enforce required `className` validation in registration form and API handler.

- [ ] **Step 3: Update src/pages/api/auth/login.ts**
  If `user.class_name` is empty/null, return `{ requiresClass: true, userId: user.id }`.

- [ ] **Step 4: Verify with astro check**
  Run: `npx astro check`

- [ ] **Step 5: Commit**
  Run: `git add src/pages/api/auth/register.ts src/pages/api/auth/login.ts src/pages/api/auth/update-class.ts src/pages/auth/register.astro && git commit -m "feat: add update-class API and enforce mandatory class selection on registration"`

---

### Task 2: Login Interception & Force Logout Check

**Files:**
- Modify: `src/pages/auth/login.astro`
- Modify: `src/pages/dashboard.astro`
- Modify: `src/pages/belajar/index.astro`

- [ ] **Step 1: Update src/pages/auth/login.astro**
  Add Class Select Modal / Interception Step when `requiresClass: true` is returned during login.

- [ ] **Step 2: Enforce Force Logout on Dashboard & Catalog Pages**
  In SSR frontmatter of `src/pages/dashboard.astro` and `src/pages/belajar/index.astro`:
  If `user` exists but `!user.class_name || user.class_name.trim() === ''`:
  - Clear `session_id` cookie
  - Redirect to `/auth/login?reason=missing_class` with alert banner: `"Identitas Kelas wajib diisi. Silakan login kembali dan atur kelas Anda."`

- [ ] **Step 3: Verify with astro check & npm run build**
  Run: `npx astro check && npm run build`

- [ ] **Step 4: Commit**
  Run: `git add src/pages/auth/login.astro src/pages/dashboard.astro src/pages/belajar/index.astro && git commit -m "feat: enforce login class completion and auto-logout users without class identity"`
