# Proyek Basis Data SQL SmartMart POS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun modul tugas proyek basis data SQL "SmartMart POS" lengkap dengan panduan terstruktur 2 pekan untuk siswa Kelas 11 RPL, form pengumpulan proyek tim (2 orang), dan portal grading guru di `/admin/lkpd`.

**Architecture:** 
- Neon PostgreSQL database migration untuk tabel `sql_project_submissions`.
- API endpoint `/api/sql/submit-project` untuk submit/update proyek siswa dan `/api/admin/grade-sql-project` untuk penilaian guru.
- Halaman interaktif siswa `/belajar/sql/proyek.astro` dengan panduan studi kasus, skema 6 tabel, 5 tantangan query analitik, dan form submission.
- Integrasi ke katalog SQL `/belajar/sql/index.astro` dan penambahan Tab Proyek di portal guru `/admin/lkpd.astro`.

**Tech Stack:** Astro, TypeScript, PostgreSQL (Neon Serverless), Tailwind/CSS Design Tokens.

## Global Constraints
- Target Pengguna: Siswa Kelas 11 RPL (Kelompok 2 Siswa) & Guru (Pak Suhendar & Pak Sopiyudin).
- Durasi Pengerjaan: 2 Pekan.
- 6 Tabel Wajib: `kategori`, `produk`, `kasir`, `pelanggan`, `transaksi`, `detail_transaksi`.
- 5 Query Wajib: Multi-table JOIN (5 tabel), Agregasi Omset/Kategori, Top 3 Produk/Shift Kasir, Deteksi Stok Kritis/Dead Stock, dan Database View Harian.
- Menggunakan design tokens yang responsif dan konsisten dengan antarmuka tema gelap & terang.

---

### Task 1: Database Migration `sql_project_submissions`

**Files:**
- Create: `scratch/migrate_sql_project_table.ts`

- [ ] **Step 1: Write migration script**
- [ ] **Step 2: Run migration script via npx tsx**
- [ ] **Step 3: Verify table creation in database**

---

### Task 2: API Endpoints untuk Proyek SQL

**Files:**
- Create: `src/pages/api/sql/submit-project.ts`
- Create: `src/pages/api/admin/grade-sql-project.ts`

- [ ] **Step 1: Write submit-project API with session auth validation**
- [ ] **Step 2: Write grade-sql-project API with teacher role validation**
- [ ] **Step 3: Test API payloads with dummy verification script**

---

### Task 3: Halaman Panduan & Submission Siswa (`/belajar/sql/proyek`)

**Files:**
- Create: `src/pages/belajar/sql/proyek.astro`

- [ ] **Step 1: Create layout, roadmap 2 pekan, and accordion guide for SmartMart POS**
- [ ] **Step 2: Implement 6 table specs and 5 analytical queries rubric**
- [ ] **Step 3: Implement submission form (team member selection, links, 5 query textareas)**
- [ ] **Step 4: Add score & teacher feedback display for evaluated submissions**
- [ ] **Step 5: Apply responsive mobile optimization and token theme styling**

---

### Task 4: Integrasi Banner Tugas Proyek di Katalog SQL (`/belajar/sql`)

**Files:**
- Modify: `src/pages/belajar/sql/index.astro`

- [ ] **Step 1: Add Special Project Callout Banner directing students to `/belajar/sql/proyek`**
- [ ] **Step 2: Ensure proper badge and completion indicator**

---

### Task 5: Portal Penilaian Guru di `/admin/lkpd`

**Files:**
- Modify: `src/pages/admin/lkpd.astro`

- [ ] **Step 1: Query `sql_project_submissions` joined with `users`**
- [ ] **Step 2: Add Tab "PROYEK: SmartMart POS" with dynamic filter counters**
- [ ] **Step 3: Render team project cards with score badges**
- [ ] **Step 4: Implement full project inspector drawer (links, 5 queries viewer, and grading form)**
- [ ] **Step 5: Add CSV Export support for SQL Project**

---

### Task 6: Verifikasi, Type Check & Deployment

**Files:**
- Modify: `src/pages/admin/lkpd.astro`, `src/pages/belajar/sql/proyek.astro`

- [ ] **Step 1: Run `npx astro check` and ensure 0 errors**
- [ ] **Step 2: Run `npx vercel build --prod`**
- [ ] **Step 3: Commit and deploy prebuilt bundle to Vercel production**
- [ ] **Step 4: Verify live URLs and report to user**
