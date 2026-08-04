# Task 1 Brief: Setup Astro SSR Mode & Dependencies

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: Node environment
- Produces: Astro SSR enabled with `@astrojs/vercel`, `bcryptjs`, `@codemirror/lang-sql`, `sql.js`

## Requirements:
1. Install dependencies:
   `npm install @astrojs/vercel @vercel/postgres bcryptjs sql.js @codemirror/lang-sql @codemirror/view @codemirror/state`
   `npm install -D @types/bcryptjs @types/sql.js`
2. Modify `astro.config.mjs` to set `output: 'server'` and `adapter: vercel()`.
3. Verify build with `npx astro check` and `npm run build`.
4. Commit changes with message `feat: enable Astro SSR mode with vercel adapter and SQL dependencies`.
5. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-1-report.md`.
