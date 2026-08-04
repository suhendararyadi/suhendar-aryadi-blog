# Task 6 Brief: Custom Copy Code Button for Code Blocks

**Files:**
- Modify: `src/layouts/MainLayout.astro`

**Interfaces:**
- Consumes: Shiki code block elements `<pre>` rendered inside Markdown/MDX pages
- Produces: Tombol copy code interaktif dengan efek feedback ("📋 Copy" -> "✅ Copied!") pada setiap blok kode tutorial

## Requirements:
1. Update `src/layouts/MainLayout.astro` with client-side script that querySelectorAll `pre` code blocks.
2. Inject a copy button inside each `<pre>` element.
3. Handle click event to write code content to `navigator.clipboard.writeText()`.
4. Provide visual feedback ("✅ Copied!") for 2 seconds before reverting to "📋 Copy".
5. Add global styles for `.copy-code-btn` with glassmorphic positioning in top-right of `<pre>`.
6. Verify with `npx astro check` and `npm run build`.
7. Commit changes with message `feat: add copy code button for code blocks in tutorials`.
8. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-suhendar-aryadi-blog-plan/task-6-report.md`.
