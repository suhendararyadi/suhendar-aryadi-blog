# Task 4 Report: Content Collections Schema & Sample Content

**Status:** DONE  
**Commit Hash:** fbcee80d5a434ab5c37288b0663b0c011116412c (`fbcee80`)

## Summary of Changes:
1. Created `src/content/config.ts`:
   - Defined `posts` collection schema with `z.object({ title, description, pubDate, author, tags, category, featured })`.
   - Defined `modules` collection schema with `z.object({ title, subject, grade, downloadUrl, tags })`.
   - Exported `collections = { posts: postsCollection, modules: modulesCollection }`.
2. Created `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md`:
   - Added valid frontmatter matching `posts` schema (including `featured: true`, tags, category, pubDate, author).
   - Written rich tutorial content in Markdown introducing Astro framework to SMK RPL students.
3. Created `src/content/modules/pemrograman-web-dasar-smk.md`:
   - Added valid frontmatter matching `modules` schema (including subject, grade, downloadUrl, tags).
   - Written rich SMK RPL teaching module content with learning achievements, chapters, and download link.

## Verification Results:
- `npx astro check`: SUCCESS (0 errors, 0 warnings, 0 hints across 8 files). Generated `.astro/types.d.ts`.
- `npm run build` (`npx astro check && npx astro build && pagefind --site dist`): SUCCESS (Static build and search index generation completed without errors).

## Concerns / Notes:
- None. Content collections schema and sample data are ready to be queried by pages in upcoming tasks (Blog index, Post detail, Module listing, etc.).
