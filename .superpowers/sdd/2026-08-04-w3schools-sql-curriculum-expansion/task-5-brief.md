# Task 5 Brief: Enhanced Student Dashboard (/dashboard.astro)

**Files:**
- Modify: `src/pages/dashboard.astro`

**Interfaces:**
- Consumes: `user_progress`, `sql_lessons`
- Produces: Dashboard showing progress breakdown across the 5 Learning Paths and 4-tier rank badges.

## Requirements:
1. Update `src/pages/dashboard.astro`:
   - Calculate completed lessons per Learning Path:
     - 🟢 **Path 1: SQL Basics** (`basics`, 10 lessons)
     - 🟡 **Path 2: SQL Aggregates & Functions** (`aggregates`, 8 lessons)
     - 🔵 **Path 3: SQL Joins & Relasi Tabel** (`joins`, 6 lessons)
     - 🟣 **Path 4: SQL Grouping & Subqueries** (`grouping`, 6 lessons)
     - 🟧 **Path 5: SQL DDL, Constraints & Security** (`ddl_security`, 10 lessons)
   - Render 5 progress bars for each Learning Path.
   - Implement 4-tier rank badge system based on total completed modules:
     - 🟢 **SQL Novice** (1 - 10 Modul)
     - 🟡 **SQL Intermediate** (11 - 24 Modul)
     - 🔵 **SQL Advanced** (25 - 39 Modul)
     - 🏆 **Master SQL Engineer** (40 Modul Selesai)
   - Display list of completed lessons sorted by recent completion date.
2. Verify with `npx astro check`.
3. Commit changes with message `feat: enhance student dashboard with multi-path analytics and 4-tier rank badges`.
4. Write report file to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-w3schools-sql-curriculum-expansion/task-5-report.md`.
