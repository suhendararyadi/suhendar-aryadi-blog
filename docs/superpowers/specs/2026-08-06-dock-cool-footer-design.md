# Design Specification: Dock.cool Inspired Footer with Floating macOS Dock Navigation

**Date**: 2026-08-06  
**Target File**: `src/components/Footer.astro` & `src/styles/global.css`  
**Author**: Antigravity Assistant & Suhendar Aryadi, S.Pd.,Gr.

---

## 1. Overview & Objective

Redesign the site footer across `suhendararyadi.com` inspired by the modern, high-end aesthetics of [dock.cool](https://www.dock.cool/). The new footer will feature:
- A **Hero CTA Section** at the top of the footer encouraging students to start learning or access LKPD.
- A **4-Column Glassmorphic Content Grid** detailing learning modules, admin links, and brand identity.
- A **Floating macOS Smart Dock Navigation Bar** pinned at the bottom center of the screen (or footer base on mobile) with interactive quick-action icons and tooltips.
- A **Real-Time System Status Badge** indicating live server operational status.

---

## 2. Design Architecture & Components

### A. Hero Call-to-Action (CTA) Card
- **Headline**: "Siap Menguasai Informatika & Pemrograman Web?"
- **Subtitle**: "Akses modul interaktif, praktikum visualizer 4 pilar BK, dan platform latihan SQL gratis."
- **Primary CTA Button**: Glowing glassmorphism button with hover micro-animation leading to `/belajar`.
- **Secondary CTA Button**: Outline button leading to `/belajar/informatika/bk/lkpd`.

### B. Content Grid (4 Columns)
1. **Brand & Tagline**:
   - Logo: `Suhendar Aryadi` with gradient text effect.
   - Tagline: "Pendidikan Vokasi IT — Siap Kerja, Santun, Mandiri, Kreatif."
   - **System Status Pill**: `🟢 System Operational • Lakebase Postgres Active` with subtle pulsing green light.
2. **Modul Belajar**:
   - Informatika SMK (Fase E)
   - LKPD 4 Pilar BK
   - Interactive SQL Sandbox
   - Blog & Tutorial Coding
3. **Portal & Navigasi**:
   - Dashboard Siswa
   - Rekap Nilai (Portal Guru)
   - Portofolio Proyek
   - Tentang Guru
4. **Koneksi & Medsos**:
   - GitHub Repository
   - LinkedIn Profile
   - Email Kontak Guru

### C. Floating macOS Smart Dock Nav Bar
- **Position**: Floating fixed/sticky pill bar at the bottom center of the viewport.
- **Styling**: Dark glassmorphism (`backdrop-filter: blur(16px)`, `background: rgba(15, 23, 42, 0.82)`), rounded 9999px pill border with inset subtle highlight border.
- **Items**:
  1. `Beranda` (`/`) — Home Icon
  2. `Belajar` (`/belajar`) — Book / Graduation Cap Icon
  3. `LKPD` (`/belajar/informatika/bk/lkpd`) — Clipboard Check Icon
  4. `SQL Lab` (`/belajar/sql`) — Database Icon
  5. `Dashboard` (`/dashboard`) — User Avatar Icon
  6. `Portal Guru` (`/admin/dashboard`) — Shield / Key Icon
- **Micro-Interactions**: Hover bounce / scale effect (`transform: scale(1.15) translateY(-4px)`), SVG glow highlight, and active page indicator dot.

### D. Sub-Footer Copyright Row
- Text: `© 2026 Suhendar Aryadi, S.Pd.,Gr. • Dibuat dengan ♥ untuk Pendidikan Vokasi SMK`.
- Minimalist, high contrast, clean typography without emoji clutter.

---

## 3. Responsive & Mobile Ergonomics

- On desktop screens ($\ge 768\text{px}$), the Floating macOS Dock remains fixed at the bottom center of the screen with smooth hover tooltips.
- On mobile screens ($< 768\text{px}$), the Dock smoothly docks to the bottom edge with optimized touch targets ($44\text{px}\times 44\text{px}$) so it never obstructs content or mobile keyboards.

---

## 4. Verification Criteria

1. Verify layout across desktop and mobile devices.
2. Confirm zero linter/type check errors with `npx astro check`.
3. Confirm production build success with `npm run build`.
