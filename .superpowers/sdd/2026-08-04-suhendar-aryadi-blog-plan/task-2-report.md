# Task 2 Report: Design System & Theme Switcher (global.css & favicon.svg)

**Status:** DONE  
**Commit Hash:** 3a5f3fb4ce3a7a35d3648959e5372242d9f9210f (`3a5f3fb`)

## Summary of Changes:
1. Created `public/favicon.svg` with a clean code icon SVG representation featuring a subtle drop-shadow filter and indigo-to-cyan gradient background.
2. Created `src/styles/global.css` featuring:
   - Root CSS custom properties for dark theme (default) including `--bg-primary`, `--bg-secondary`, `--bg-card`, `--text-primary`, `--text-secondary`, `--accent-primary`, `--accent-cyan`, `--accent-gradient`, etc.
   - Light theme overrides defined under `[data-theme="light"]`.
   - Utility classes: `.container`, `.glass-card`, `.glass-card-interactive`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.badge`, `.badge-cyan`, `.text-gradient`.
   - CSS Reset & smooth transitions for background-color, color, transform, box-shadow, and border-color across theme changes and interactions.

## Verification Results:
- `npx astro check`: SUCCESS (0 errors, 0 warnings, 0 hints).
- `npx astro build`: SUCCESS (Static build completed cleanly).

## Concerns / Notes:
- None. Global styles and design tokens are in place for components and layouts in subsequent tasks.
