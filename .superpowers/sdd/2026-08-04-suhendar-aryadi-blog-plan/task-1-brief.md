# Task 1 Brief: Scaffolding Proyek Astro v4

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: Node environment & npm
- Produces: Proyek Astro v4 yang dapat di-run via `npm run dev` dan di-build via `npm run build`

## Requirements:
1. Write `package.json` with Astro v4 dependencies (`astro`, `@astrojs/check`, `@astrojs/mdx`, `typescript`, `pagefind`).
2. Run `npm install` to install all dependencies cleanly.
3. Write `astro.config.mjs` with MDX integration and Shiki github-dark code theme.
4. Write `tsconfig.json` extending `astro/tsconfigs/strict` with alias `@/*` pointing to `src/*`.
5. Write a basic placeholder `src/pages/index.astro`.
6. Run `npx astro build` to verify clean compilation.
7. Commit changes to git with message `feat: setup Astro v4 project scaffolding`.
