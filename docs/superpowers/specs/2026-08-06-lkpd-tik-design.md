# Design Specification: LKPD Digital Elemen 2 (TIK) & Admin Grading Portal

**Date**: 2026-08-06  
**Target Files**: 
- `src/pages/belajar/informatika/tik.astro` (Add CTA button to LKPD TIK)
- `src/pages/belajar/informatika/tik/lkpd.astro` (Interactive LKPD TIK Student Page)
- `src/pages/api/lkpd/submit-tik.ts` (API route for student LKPD TIK submissions)
- `src/pages/api/admin/grade-lkpd-tik.ts` (API route for teacher grading)
- `src/pages/admin/lkpd.astro` (Update admin portal with LKPD BK & LKPD TIK tab filter)
- `scripts/migrate.js` (Add `lkpd_tik_submissions` table)

**Author**: Antigravity Assistant & Suhendar Aryadi, S.Pd.,Gr.

---

## 1. Overview & Objectives

Build a comprehensive interactive **LKPD (Lembar Kerja Peserta Didik) Digital** for **Elemen 2: Teknologi Informasi dan Komunikasi (TIK)** covering:
1. **Integrasi Aplikasi Perkantoran**: Mail Merge (Spreadsheet to Word/Certificates) & Object Linking and Embedding (OLE).
2. **Advanced Search Operators**: Formulasi pencarian presisi (`filetype:pdf`, `site:.go.id`, `"frasa persis"`, `-kata_diabaikan`) & verifikasi sumber digital.

---

## 2. Database Schema (`scripts/migrate.js`)

Add table `lkpd_tik_submissions`:
```sql
CREATE TABLE IF NOT EXISTS lkpd_tik_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  case_study_id VARCHAR(50) NOT NULL,
  team_name VARCHAR(150) DEFAULT '',
  team_members TEXT DEFAULT '[]',
  mail_merge_json TEXT DEFAULT '{}',
  search_operators_json TEXT DEFAULT '{}',
  reflection_json TEXT DEFAULT '{}',
  score INT DEFAULT NULL,
  teacher_feedback TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Component & Page Specifications

### A. Material Page (`src/pages/belajar/informatika/tik.astro`)
- Add prominent CTA button: `🚀 Buka LKPD Digital Interaktif TIK →` pointing to `/belajar/informatika/tik/lkpd`.

### B. Student LKPD TIK Page (`src/pages/belajar/informatika/tik/lkpd.astro`)
- Requires authenticated user login (`if (!user) return Astro.redirect(...)`).
- Checks assignment deadline setting (`lkpd_deadline`).
- Displays teacher evaluation score banner if graded (`existingSubmission.score`).
- **Worksheet Sections**:
  1. **Identitas Tim & Studi Kasus TIK**: Team name, members, case study selection.
  2. **Aktivitas 1 (Mail Merge & OLE Integration)**: Master data table header fields, Word template tags (`«nama»`, `«kelas»`), OLE workflow explanation.
  3. **Aktivitas 2 (Advanced Search Operators)**: Target topic, constructed query string, verified digital sources.
  4. **Bagian 3 (Refleksi Tim)**: Efficiency analysis of digital document integration.
- Includes draft saving / submission submit button & Print / PDF Export functionality.

### C. Backend API Routes
1. `/api/lkpd/submit-tik.ts`: Handles POST request, enforces deadline check, saves to `lkpd_tik_submissions`.
2. `/api/admin/grade-lkpd-tik.ts`: Handles POST request `{ submissionId, score, teacherFeedback }` to update teacher grades.

### D. Teacher Admin Portal Upgrade (`src/pages/admin/lkpd.astro`)
- Add tab toggle filter between **LKPD BK (Berpikir Komputasional)** and **LKPD TIK (Teknologi Informasi & Komunikasi)**.
- Include complete student answer drawer view for LKPD TIK and CSV export integration.

---

## 4. Verification & Testing Criteria

1. Run `npx tsx scripts/migrate.js` to create database table on Lakebase Postgres.
2. Run `npx astro check` to confirm 0 TypeScript/Astro errors.
3. Run `npm run build` to confirm production build succeeds cleanly.
