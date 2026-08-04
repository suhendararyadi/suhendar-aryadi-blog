# Task 3 Brief: Komponen Navigasi & Layout Utama (ThemeToggle, Header, Footer, MainLayout)

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/MainLayout.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` & Astro layout props (`title`, `description`)
- Produces: Header responsif, ThemeToggle interaktif (localStorage theme switcher), Footer, & `MainLayout.astro`

## Requirements:
1. Create `src/components/ThemeToggle.astro`:
   - Interactive theme toggle button with sun/moon icons.
   - Script checking `localStorage.getItem('theme')` (defaulting to 'dark') and toggling `data-theme` attribute on `document.documentElement`.
2. Create `src/components/Header.astro`:
   - Sticky top glassmorphism navigation header.
   - Logo with `</>` code icon and text "Suhendar Aryadi".
   - Links: Beranda (`/`), Materi RPL (`/materi`), Blog & Tutorial (`/blog`), Portofolio (`/portofolio`), Tentang Guru (`/tentang`). Active state styling.
   - Includes `<ThemeToggle />`.
3. Create `src/components/Footer.astro`:
   - Dynamic year `new Date().getFullYear()`.
   - Copyright text: "Suhendar Aryadi, S.Kom. | Guru Jurusan RPL SMK."
   - Tagline: "Pendidikan Vokasi IT - Siap Kerja, Santun, Mandiri, Kreatif."
4. Create `src/layouts/MainLayout.astro`:
   - Standard HTML5 shell importing `../styles/global.css`.
   - Dynamic `<title>` and meta description.
   - Embeds `<Header />`, `<main class="container page-content"><slot /></main>`, and `<Footer />`.
5. Verify build and types with `npx astro check` and `npx astro build`.
6. Commit changes with message `feat: add Header, Footer, ThemeToggle, and MainLayout components`.
7. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-suhendar-aryadi-blog-plan/task-3-report.md`.
