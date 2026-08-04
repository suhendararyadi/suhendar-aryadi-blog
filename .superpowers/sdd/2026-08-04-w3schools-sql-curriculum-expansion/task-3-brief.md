# Task 3 Brief: Categorized Catalog UI & Learning Paths Filtering (/belajar/sql/index.astro)

**Files:**
- Modify: `src/pages/belajar/sql/index.astro`

**Interfaces:**
- Consumes: `seedLessons`, `user_progress`
- Produces: Categorized catalog UI grouped into 5 Learning Paths with interactive filter tabs and path progress indicators.

## Requirements:
1. Update `/belajar/sql/index.astro`:
   - Group the 40 SQL lessons into 5 Learning Path sections:
     - 🟢 **Path 1: SQL Basics** (`basics`) - Modul 1-10
     - 🟡 **Path 2: SQL Aggregates & Functions** (`aggregates`) - Modul 11-18
     - 🔵 **Path 3: SQL Joins & Relasi Tabel** (`joins`) - Modul 19-24
     - 🟣 **Path 4: SQL Grouping & Subqueries** (`grouping`) - Modul 25-30
     - 🟧 **Path 5: SQL DDL, Constraints & Security** (`ddl_security`) - Modul 31-40
   - Add path-specific progress bars showing how many lessons in each path the student has completed.
   - Add interactive filter tabs (`Semua`, `Basics`, `Aggregates`, `Joins`, `Grouping`, `DDL & Security`).
   - Show lesson badges (`data_match` vs `schema_match`), order index, titles, and completion checkmarks `✅ Selesai`.
2. Verify with `npx astro check`.
3. Commit changes with message `feat: enhance SQL catalog page with 5 Learning Path sections and level filters`.
4. Write report file to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-w3schools-sql-curriculum-expansion/task-3-report.md`.
