# Design Specification: Subject-Level Course Enrollment & Grade Recap

**Date**: 2026-08-08  
**Target Files**: 
- `scripts/migrate.js` (Update subject-level course_enrollments auto-seeding)
- `src/pages/api/courses/enroll.ts` (API route for Subject enrollment validation)
- `src/pages/dashboard.astro` (Student dashboard subject-level grade recap & enrollment UI)
- `src/pages/belajar/index.astro` (Course catalog subject-level enrollment integration)

**Author**: Antigravity Assistant & Suhendar Aryadi, S.Pd.,Gr.

---

## 1. Overview & Objectives

Refactor the Course Enrollment System from individual module level to **Mata Pelajaran (Subject)** level:
1. **Mata Pelajaran 1: Informatika SMK (Fase E)** (`subject_id: 'informatika'`)
   - *Scope*: All 8 elements of Informatika (LKPD BK, LKPD TIK, Sistem Komputer, Algoritma & Pemrograman, etc.).
   - *Access Code*: `INFORMATIKA2026` or `INF2026`.
   - *Auto-Enrollment*: Auto-enrolled if student has LKPD BK or LKPD TIK submission.
2. **Mata Pelajaran 2: Pemrograman Web & Basis Data (RPL)** (`subject_id: 'rpl_web_sql'`)
   - *Scope*: Practical SQL Masterclass (40 Modules), HTML5/CSS3 Responsive Web Design, Web Development.
   - *Access Code*: `RPL2026`, `BASISDATA2026`, or `SQL2026`.
   - *Auto-Enrollment*: Auto-enrolled if student has SQL progress.
3. **Mata Pelajaran 3: Pemrograman Berbasis Objek (PBO)** (`subject_id: 'pbo'`)
   - *Scope*: OOP, Java, & Software Architecture.
   - *Access Code*: `PBO2026`.

Enrolling in a **Mata Pelajaran** unlocks **all** contained modules and displays consolidated grade recaps for that entire subject.

---

## 2. API Validation (`src/pages/api/courses/enroll.ts`)

- Accepts POST `{ subjectId, accessCode }`.
- Subject-level access codes:
  - `informatika`: `INFORMATIKA2026`, `INF2026`, `BK2026`, `TIK2026`
  - `rpl_web_sql`: `RPL2026`, `BASISDATA2026`, `SQL2026`
  - `pbo`: `PBO2026`
- Inserts `(user_id, subjectId)` into `course_enrollments`.

---

## 3. Student Dashboard (`src/pages/dashboard.astro`)

- **Header Section**: `Rekap Nilai & Enrollment Mata Pelajaran`
- Displays cards for each **Mata Pelajaran (Subject)**:
  - **Mata Pelajaran Informatika SMK**:
    - Status: `✓ TERDAFTAR MATA PELAJARAN`
    - Rekap Nilai LKPD BK: `96 / 100` (Feedback Guru)
    - Rekap Nilai LKPD TIK: `93 / 100` (Feedback Guru)
    - **Rata-Rata Nilai Mata Pelajaran**: `94.5 / 100`
    - Action: `Buka Modul Informatika →`
  - **Mata Pelajaran Pemrograman Web & Basis Data**:
    - Status: `✓ TERDAFTAR MATA PELAJARAN`
    - Rekap Progress SQL: `40 / 40 Modul Selesai`
    - Predikat Kompetensi: `Master SQL Engineer`
    - Action: `Buka Modul SQL & Web →`
- For locked subjects: Displays `🔒 Enroll Mata Pelajaran Ini (Masukan Kode)` which triggers the Access Code Modal.

---

## 4. Course Catalog (`src/pages/belajar/index.astro`)

- Groups courses by **Mata Pelajaran**.
- Cards display `✓ TERDAFTAR (MATA PELAJARAN)` vs `🔒 BELUM ENROLL`.
- Enrolling at catalog page unlocks all child modules.
