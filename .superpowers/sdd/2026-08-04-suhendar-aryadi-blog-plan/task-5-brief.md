# Task 5 Brief: Halaman Publik (Beranda, Blog, Materi, Portofolio, Tentang Guru)

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/materi/index.astro`
- Create: `src/pages/materi/[...slug].astro`
- Create: `src/pages/portofolio.astro`
- Create: `src/pages/tentang.astro`

**Interfaces:**
- Consumes: `MainLayout.astro`, `getCollection('posts')`, `getCollection('modules')`
- Produces: Halaman web publik yang lengkap, terstruktur, dan interaktif

## Requirements:
1. Update `src/pages/index.astro`:
   - Hero Section with profile description for Suhendar Aryadi, S.Kom., badge "Guru RPL SMK & Tech Educator", CTA buttons ("📚 Lihat Materi RPL" and "🚀 Portofolio & Karya").
   - Highlight Section fetching `getCollection('posts')` filtered by `featured: true`.
   - Modul Section fetching `getCollection('modules')`.
2. Create `src/pages/blog/index.astro`:
   - Lists all blog posts fetched via `getCollection('posts')` ordered by `pubDate`.
3. Create `src/pages/blog/[...slug].astro`:
   - Dynamic route using `getStaticPaths()`.
   - Renders post frontmatter metadata and `<Content />` component inside styled prose.
4. Create `src/pages/materi/index.astro`:
   - Lists all RPL learning modules fetched via `getCollection('modules')`.
5. Create `src/pages/materi/[...slug].astro`:
   - Dynamic route using `getStaticPaths()`.
   - Renders module frontmatter metadata, download link button if `downloadUrl` exists, and `<Content />`.
6. Create `src/pages/portofolio.astro`:
   - Showcase grid of student projects and teacher educational work.
7. Create `src/pages/tentang.astro`:
   - Profile page detailing Suhendar Aryadi, S.Kom.'s background, RPL subjects taught, and competencies.
8. Verify with `npx astro check` and `npm run build`.
9. Commit changes with message `feat: implement all public pages (home, blog, materi, portofolio, tentang)`.
10. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-suhendar-aryadi-blog-plan/task-5-report.md`.
