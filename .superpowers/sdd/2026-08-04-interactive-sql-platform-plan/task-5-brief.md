# Task 5 Brief: W3Schools SQL Course Seed Data (lib/seedLessons.ts)

**Files:**
- Create: `src/lib/seedLessons.ts`

**Interfaces:**
- Consumes: W3Schools SQL Fundamentals Curriculum
- Produces: Pre-populated SQL lessons for `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`

## Requirements:
1. Create `src/lib/seedLessons.ts` exporting an array of interactive SQL lessons:
   - Lesson 1: Pengenalan Perintah SELECT (`sql-select-all`)
   - Lesson 2: Filter Data Menggunakan WHERE (`sql-where-clause`)
   - Lesson 3: Mengurutkan Data dengan ORDER BY (`sql-order-by`)
   - Lesson 4: Menambahkan Data Baru dengan INSERT INTO (`sql-insert-into`)
   - Lesson 5: Memperbarui Data dengan UPDATE (`sql-update-data`)
2. Each lesson must have `id`, `slug`, `title`, `category`, `order_index`, `theory_markdown`, `instructions_markdown`, `seed_sql`, `expected_sql`, `initial_code`.
3. Verify with `npx astro check`.
4. Commit changes with message `feat: add initial W3Schools SQL course seed data`.
5. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-5-report.md`.
