# Dock.cool Inspired Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `src/components/Footer.astro` to feature a Hero CTA banner, a 4-column glassmorphism content grid, a live system status indicator, and a floating macOS Smart Dock navigation bar pinned at the bottom of the screen.

**Architecture:** Update `Footer.astro` with new HTML structure & scoped CSS, add global variables if needed, and ensure responsive display on all screen sizes.

**Tech Stack:** Astro v4, HTML5, Vanilla CSS, SVG icons.

## Global Constraints

- Preserve all existing routes (`/`, `/belajar`, `/belajar/informatika/bk/lkpd`, `/belajar/sql`, `/dashboard`, `/admin/dashboard`, `/portofolio`, `/tentang`).
- Pure Vanilla CSS without Tailwind.
- High visual aesthetics: glassmorphism backdrop blur, subtle ambient glow, micro-hover elevation.
- Clean typography without emoji clutter in text elements.

---

### Task 1: Rebuild Footer Component with Dock.cool Aesthetics

**Files:**
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: Astro layout, `currentYear`
- Produces: `<Footer />` component rendered on all pages

- [ ] **Step 1: Inspect existing Footer.astro structure**
  Verify the layout structure in `src/components/Footer.astro`.

- [ ] **Step 2: Update Footer.astro template and styles**
  Replace `Footer.astro` content with:
  1. Top Hero CTA Card: Headline, Subtitle, Glowing CTA button to `/belajar` and secondary button to LKPD.
  2. Main Content Grid (4 Columns):
     - Brand & Tagline + Live Status Badge (`🟢 System Operational • Lakebase Postgres Active`).
     - Modul Belajar links.
     - Portal & Navigasi links.
     - Koneksi & Medsos links.
  3. Sub-Footer Row: Copyright & Credits.
  4. Floating macOS Smart Dock Nav Bar (`.floating-dock`):
     - Pinned fixed bottom center (`position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 999;`).
     - Dark glassmorphism (`backdrop-filter: blur(16px); background: rgba(15, 23, 42, 0.82); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 9999px;`).
     - 6 Interactive SVG Dock Icons with tooltips (Home, Belajar, LKPD, SQL Lab, Dashboard, Portal Admin).

- [ ] **Step 3: Test build and static checks**
  Run: `npx astro check`
  Expected: 0 errors.

- [ ] **Step 4: Verify production build**
  Run: `npm run build`
  Expected: Build succeeds cleanly.

- [ ] **Step 5: Commit changes**
  Run: `git add src/components/Footer.astro && git commit -m "feat: implement dock.cool inspired footer with hero CTA and floating macOS smart dock navigation"`
