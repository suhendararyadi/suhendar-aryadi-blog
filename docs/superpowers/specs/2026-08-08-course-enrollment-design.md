# Design Specification: Course Enrollment System & Student Grade Recap

**Date**: 2026-08-08  
**Target Files**: 
- `scripts/migrate.js` (Add `course_enrollments` table)
- `src/pages/api/courses/enroll.ts` (API route for module enrollment with access codes)
- `src/pages/dashboard.astro` (Student dashboard grade recap & course enrollment UI)
- `src/pages/belajar/index.astro` (Course catalog status & enrollment integration)

**Author**: Antigravity Assistant & Suhendar Aryadi, S.Pd.,Gr.

---

## 1. Overview & Objectives

Implement a **Course Enrollment System** where students can:
1. See grade recaps for modules they have **enrolled in**.
2. **Auto-enroll** automatically if they already have LKPD submissions (BK/TIK) or SQL progress.
3. **Manual enroll** into locked modules by entering a Class / Teacher Access Code (e.g., `BK2026`, `TIK2026`, `SQL2026`, `SK2026`, `AP2026`, or universal code `RPL2026`).

---

## 2. Database Schema (`scripts/migrate.js`)

```sql
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);
```

---

## 3. Auto-Sync Logic

On `/dashboard` and `/belajar` load:
- If user has row in `lkpd_submissions` -> Auto insert `(user_id, 'bk')`.
- If user has row in `lkpd_tik_submissions` -> Auto insert `(user_id, 'tik')`.
- If user has row in `user_progress` -> Auto insert `(user_id, 'sql')`.

---

## 4. Enrollment API (`src/pages/api/courses/enroll.ts`)

Accepts POST `{ courseId, accessCode }`. Validates:
- Universal codes: `RPL2026`, `INFORMATIKA2026`
- Specific codes: `BK2026` (for bk), `TIK2026` (for tik), `SQL2026` (for sql), `SK2026` (for sk), `AP2026` (for ap).
- On success: Inserts into `course_enrollments` and returns 200 JSON `{ success: true, message: 'Berhasil terdaftar pada modul!' }`.

---

## 5. UI Layout on Student Dashboard (`/dashboard`)

- **Rekap Nilai & Status Enroll Modul Pembelajaran**:
  - Grid of 5 Course Cards (`bk`, `tik`, `sql`, `sk`, `ap`).
  - Enrolled cards display Grade Score (0-100), Teacher Feedback, Status, and CTA link.
  - Locked cards display `BELUM TERDAFTAR` badge and `🔒 Enroll Modul Ini` button which opens an Access Code Input Modal.
