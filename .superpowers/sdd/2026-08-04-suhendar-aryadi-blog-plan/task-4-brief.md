# Task 4 Brief: Content Collections Schema & Sample Content

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md`
- Create: `src/content/modules/pemrograman-web-dasar-smk.md`

**Interfaces:**
- Consumes: Astro Content Collections Zod Schema
- Produces: Strongly typed `posts` dan `modules` collections

## Requirements:
1. Create `src/content/config.ts`:
   - Define `posts` collection schema with `z.object({ title, description, pubDate, author, tags, category, featured })`.
   - Define `modules` collection schema with `z.object({ title, subject, grade, downloadUrl, tags })`.
   - Export `collections = { posts, modules }`.
2. Create sample post `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md` with valid frontmatter matching `posts` schema and rich tutorial content.
3. Create sample module `src/content/modules/pemrograman-web-dasar-smk.md` with valid frontmatter matching `modules` schema and RPL module content.
4. Verify schema with `npx astro check` and `npx astro build`.
5. Commit changes with message `feat: setup Content Collections schema and sample posts/modules`.
6. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-suhendar-aryadi-blog-plan/task-4-report.md`.
