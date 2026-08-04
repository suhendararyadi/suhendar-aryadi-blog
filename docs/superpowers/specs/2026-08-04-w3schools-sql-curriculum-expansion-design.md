# Design Specification: 40-Module W3Schools Interactive SQL Curriculum Expansion

**Date:** 2026-08-04  
**Author:** Antigravity AI & Suhendar Aryadi, S.Kom.  
**Target Audience:** Students of SMK Software Engineering (Rekayasa Perangkat Lunak - RPL)  
**Status:** APPROVED BY USER  

---

## 1. Executive Summary

This design specification details the full-scale expansion of the Interactive SQL Learning Platform integrated into Suhendar Aryadi's Astro blog repository. The platform expands from 5 initial basic SQL lessons into a comprehensive **40-module interactive curriculum** mapped directly from the industry-standard **W3Schools SQL Tutorial**.

The platform features:
- **5 Structured Learning Paths** (Basics, Aggregates & Functions, Joins & Relations, Grouping & Advanced, DDL & Security).
- **Dual-mode Evaluator Sandbox** (Data-matching for SELECT/DML queries and Schema-validation for DDL statements like `CREATE TABLE`, `ALTER TABLE`, and `CREATE VIEW`).
- **Real-time Progress Persistence** on Vercel Serverless Functions with Neon Postgres DB and pure-JS memory fallback.
- **Categorized Catalog UI** (`/belajar/sql`) and **Enhanced Student Dashboard** (`/dashboard`).

---

## 2. Architecture & Data Schema

### 2.1 Extended SQL Lesson Model (`src/lib/seedLessons.ts` & `sql_lessons` DB table)

```typescript
export interface SQLLesson {
  id: number;
  slug: string;
  title: string;
  category: string; // e.g. "Level 1: SQL Basics", "Level 3: SQL Joins"
  path_id: 'basics' | 'aggregates' | 'joins' | 'grouping' | 'ddl_security';
  order_index: number;
  theory_markdown: string;
  instructions_markdown: string;
  seed_sql: string;
  expected_sql: string;
  initial_code: string;
  evaluator_type: 'data_match' | 'schema_match';
}
```

### 2.2 Database Schema (`scripts/migrate.js` & `src/lib/db.ts`)

```sql
CREATE TABLE IF NOT EXISTS sql_lessons (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  path_id VARCHAR(50) DEFAULT 'basics',
  order_index INT NOT NULL,
  theory_markdown TEXT NOT NULL,
  instructions_markdown TEXT NOT NULL,
  seed_sql TEXT NOT NULL,
  expected_sql TEXT NOT NULL,
  initial_code TEXT DEFAULT 'SELECT * FROM customers;',
  evaluator_type VARCHAR(50) DEFAULT 'data_match'
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES sql_lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'completed',
  submitted_code TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

---

## 3. Curriculum Mapping (40 Modules Across 5 Learning Paths)

### 🟢 Path 1: SQL Basics (Modul 1 - 10)
1. `sql-select-all`: Pengenalan Perintah `SELECT`
2. `sql-select-distinct`: Filter Nilai Unik dengan `SELECT DISTINCT`
3. `sql-where-clause`: Filter Data Menggunakan `WHERE`
4. `sql-and-or-not`: Logika Kombinasi dengan `AND`, `OR`, `NOT`
5. `sql-order-by`: Mengurutkan Data dengan `ORDER BY` (ASC/DESC)
6. `sql-insert-into`: Menambahkan Data Baru dengan `INSERT INTO`
7. `sql-null-values`: Penanganan Data Kosong dengan `IS NULL` / `IS NOT NULL`
8. `sql-update-data`: Memperbarui Data dengan `UPDATE`
9. `sql-delete-data`: Menghapus Data dengan `DELETE`
10. `sql-limit-clause`: Membatasi Baris Data dengan `LIMIT` / `TOP`

### 🟡 Path 2: SQL Aggregates & Functions (Modul 11 - 18)
11. `sql-min-max`: Mencari Nilai Minimum & Maksimum dengan `MIN()` & `MAX()`
12. `sql-count-func`: Menghitung Jumlah Record dengan `COUNT()`
13. `sql-sum-func`: Menghitung Total Jumlah dengan `SUM()`
14. `sql-avg-func`: Menghitung Rata-rata dengan `AVG()`
15. `sql-like-operator`: Pencarian Pola Teks dengan `LIKE`
16. `sql-wildcards`: Penggunaan Wildcards `%` dan `_`
17. `sql-in-operator`: Pencarian Banyak Nilai dengan `IN`
18. `sql-between-operator`: Pencarian Jangkauan Nilai dengan `BETWEEN`

### 🔵 Path 3: SQL Joins & Relasi Tabel (Modul 19 - 24)
19. `sql-aliases`: Penamaan Alias Kolom & Tabel dengan `AS`
20. `sql-inner-join`: Penggabungan Data Dua Tabel dengan `INNER JOIN`
21. `sql-left-join`: Penggabungan Data dengan `LEFT JOIN`
22. `sql-right-join`: Penggabungan Data dengan `RIGHT JOIN`
23. `sql-full-join`: Penggabungan Data Lengkap dengan `FULL JOIN`
24. `sql-union-operator`: Menggabungkan Result-Set dengan `UNION` & `UNION ALL`

### 🟣 Path 4: SQL Grouping & Subqueries (Modul 25 - 30)
25. `sql-group-by`: Pengelompokan Data dengan `GROUP BY`
26. `sql-having-clause`: Filter Kelompok Data dengan `HAVING`
27. `sql-exists-operator`: Pengujian Subquery dengan `EXISTS`
28. `sql-any-all-operators`: Subquery dengan `ANY` dan `ALL`
29. `sql-insert-into-select`: Menyalin Data antar Tabel dengan `INSERT INTO SELECT`
30. `sql-case-expression`: Logika Kondisional dengan `CASE WHEN`

### 🟧 Path 5: SQL DDL, Constraints & Security (Modul 31 - 40)
31. `sql-create-table`: Membuat Tabel Baru dengan `CREATE TABLE`
32. `sql-alter-table`: Mengubah Struktur Tabel dengan `ALTER TABLE`
33. `sql-drop-table`: Menghapus Tabel dengan `DROP TABLE`
34. `sql-not-null-constraint`: Batasan Wajib Isi dengan `NOT NULL`
35. `sql-unique-constraint`: Batasan Nilai Unik dengan `UNIQUE`
36. `sql-primary-key`: Kunci Utama Tabel dengan `PRIMARY KEY`
37. `sql-foreign-key`: Kunci Relasi antar Tabel dengan `FOREIGN KEY`
38. `sql-default-constraint`: Nilai Bawaan dengan `DEFAULT`
39. `sql-create-view`: Membuat View Database dengan `CREATE VIEW`
40. `sql-injection-security`: Simulasi & Pencegahan Bahaya `SQL Injection`

---

## 4. Evaluator Engine Expansion (`src/lib/sqlEvaluator.ts`)

The evaluator is updated to support dual evaluation modes:

1. **`data_match` Mode**: Executes expected query & user query in in-memory SQLite sandbox, comparing column names, row counts, and value contents.
2. **`schema_match` Mode**: For DDL exercises (`CREATE TABLE`, `ALTER TABLE`, `CREATE VIEW`):
   - Executes student's DDL statement.
   - Inspects SQLite master catalog (`sqlite_master`) or `PRAGMA table_info()` to verify table columns, data types, primary keys, and views exist with exact required names and constraints.

---

## 5. UI & UX Enhancements

### 5.1 Learning Paths Catalog Page (`/belajar/sql`)
- Organized into 5 distinct path sections with path-specific progress bars.
- Path filter tabs (`All`, `Basics`, `Aggregates`, `Joins`, `Grouping`, `DDL & Security`).
- Lesson cards show category badges, order index, title, and completion checks.

### 5.2 Student Dashboard (`/dashboard`)
- Detailed breakdown of completed modules per Learning Path.
- Rank badges:
  - 🟢 **SQL Novice** (1 - 10 Modules)
  - 🟡 **SQL Intermediate** (11 - 24 Modules)
  - 🔵 **SQL Advanced** (25 - 39 Modules)
  - 🏆 **Master SQL Engineer** (40 Modules Complete)

---

## 6. Verification & Quality Assurance

- **Static Check**: `npx astro check` passes with 0 errors across all 37+ files.
- **Production Build**: `npm run build` bundles SSR functions cleanly for `@astrojs/vercel`.
- **Database Resilience**: Multi-tier DB support (Neon Postgres when linked, pure JS memory fallback when unlinked).
