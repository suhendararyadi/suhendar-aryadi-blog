# Task 2 Brief: Design System & Theme Switcher (global.css & favicon.svg)

**Files:**
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: CSS Custom Properties & `data-theme` attribute pada element `<html>`
- Produces: Design Tokens (Colors, Typography, Spacing, Responsive Breakpoints, Glassmorphism utilities)

## Requirements:
1. Create `public/favicon.svg` with clean code icon SVG representation.
2. Create `src/styles/global.css` containing:
   - Root CSS Variables for Dark theme (default): `--bg-primary: #0f172a`, `--bg-secondary: #1e293b`, `--bg-card`, `--text-primary: #f8fafc`, `--text-secondary`, `--accent-primary: #6366f1`, `--accent-cyan: #06b6d4`, etc.
   - Light theme overrides under `[data-theme="light"]`.
   - Utility classes: `.container`, `.glass-card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.badge`.
   - Smooth transitions for background-color, color, transform, box-shadow.
3. Verify CSS syntax with `npx astro check`.
4. Commit changes with message `style: add global design system and CSS variables`.
5. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-suhendar-aryadi-blog-plan/task-2-report.md`.
