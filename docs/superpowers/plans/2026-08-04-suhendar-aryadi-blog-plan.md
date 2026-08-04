# Web Blog & Edutech Personal Suhendar Aryadi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun situs blog pribadi dan portal pembelajaran RPL SMK berbasis Astro v4+ untuk Suhendar Aryadi, S.Kom., lengkap dengan Content Collections, Theme Switcher, Pagefind Search, dan tampilan modern.

**Architecture:** Menggunakan Astro SSG (Static Site Generation) dengan Astro Content Collections untuk artikel blog (`posts`) dan modul RPL (`modules`), dikombinasikan dengan Vanilla CSS kustom (CSS Variables & Glassmorphism) dan pencarian statis instant Pagefind.

**Tech Stack:** Astro v4+, TypeScript, CSS Custom Properties, MDX, Pagefind, Git.

## Global Constraints
- **Framework**: Astro v4+
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism, Dark/Light Mode)
- **Content Management**: Astro Content Collections (`src/content/config.ts`)
- **Node Environment**: Node v18+ / npm

---

### Task 1: Scaffolding Proyek Astro v4

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: Node environment & npm
- Produces: Proyek Astro v4 yang dapat di-run via `npm run dev` dan di-build via `npm run build`

- [ ] **Step 1: Inisialisasi package.json dan Astro v4 dependencies**

Tulis `package.json`:
```json
{
  "name": "suhendar-aryadi-blog",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build && pagefind --site dist",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/mdx": "^3.0.0",
    "astro": "^4.10.0",
    "typescript": "^5.4.0"
  },
  "devDependencies": {
    "pagefind": "^1.1.0"
  }
}
```

- [ ] **Step 2: Jalankan npm install**

Run: `npm install`
Expected: Dependencies terinstal tanpa error.

- [ ] **Step 3: Buat astro.config.mjs & tsconfig.json**

Tulis `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://suhendararyadi.dev',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
```

Tulis `tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: Buat halaman placeholder index.astro dan verifikasi build**

Tulis `src/pages/index.astro`:
```astro
---
---
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Suhendar Aryadi | Guru RPL SMK</title>
  </head>
  <body>
    <h1>Selamat Datang di Blog Suhendar Aryadi</h1>
  </body>
</html>
```

Run: `npx astro build`
Expected: Folder `dist/` terbentuk dengan sukses tanpa error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/pages/index.astro
git commit -m "feat: setup Astro v4 project scaffolding"
```

---

### Task 2: Design System & Theme Switcher (`global.css`)

**Files:**
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: CSS Custom Properties & `data-theme` attribute pada element `<html>`
- Produces: Design Tokens (Colors, Typography, Spacing, Responsive Breakpoints, Glassmorphism utilities)

- [ ] **Step 1: Buat file `public/favicon.svg`**

Tulis `public/favicon.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="16 18 22 12 16 6"></polyline>
  <polyline points="8 6 2 12 8 18"></polyline>
</svg>
```

- [ ] **Step 2: Buat `src/styles/global.css` dengan Design System modern**

Tulis `src/styles/global.css`:
```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: rgba(30, 41, 59, 0.7);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #6366f1;
  --accent-hover: #4f46e5;
  --accent-cyan: #06b6d4;
  --border-color: rgba(255, 255, 255, 0.1);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', Fira Code, monospace;
}

[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: rgba(255, 255, 255, 0.8);
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border-color: rgba(0, 0, 0, 0.1);
  --glass-border: 1px solid rgba(0, 0, 0, 0.08);
  --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-cyan);
}

.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
  color: #ffffff;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: var(--glass-border);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(99, 102, 241, 0.15);
  color: var(--accent-primary);
}
```

- [ ] **Step 3: Verifikasi syntax CSS**

Run: `npx astro check`
Expected: Tidak ada lint/CSS error.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css public/favicon.svg
git commit -m "style: add global design system and CSS variables"
```

---

### Task 3: Komponen Navigasi & Layout Utama (`Header`, `Footer`, `ThemeToggle`, `MainLayout`)

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/MainLayout.astro`

**Interfaces:**
- Consumes: `global.css` & Astro layout props (`title`, `description`)
- Produces: Header responsif, ThemeToggle interaktif, Footer, & `MainLayout.astro`

- [ ] **Step 1: Buat `src/components/ThemeToggle.astro`**

Tulis `src/components/ThemeToggle.astro`:
```astro
---
---
<button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Mode">
  <span class="sun-icon">☀️</span>
  <span class="moon-icon">🌙</span>
</button>

<style>
  .theme-toggle-btn {
    background: none;
    border: var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.6rem;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
</style>

<script>
  const toggleBtn = document.getElementById('theme-toggle');
  const getTheme = () => localStorage.getItem('theme') || 'dark';
  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  setTheme(getTheme());

  toggleBtn?.addEventListener('click', () => {
    const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
</script>
```

- [ ] **Step 2: Buat `src/components/Header.astro`**

Tulis `src/components/Header.astro`:
```astro
---
import ThemeToggle from './ThemeToggle.astro';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/materi', label: 'Materi RPL' },
  { href: '/blog', label: 'Blog & Tutorial' },
  { href: '/portofolio', label: 'Portofolio' },
  { href: '/tentang', label: 'Tentang Guru' }
];

const pathname = Astro.url.pathname;
---
<header class="site-header">
  <div class="container header-content">
    <a href="/" class="logo">
      <span class="code-icon">&lt;/&gt;</span>
      <span class="brand-name">Suhendar Aryadi</span>
    </a>
    <nav class="nav-menu">
      {navLinks.map(link => (
        <a 
          href={link.href} 
          class:list={['nav-link', { active: pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) }]}
        >
          {link.label}
        </a>
      ))}
    </nav>
    <div class="header-actions">
      <ThemeToggle />
    </div>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    border-bottom: var(--glass-border);
    padding: 1rem 0;
  }
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--text-primary);
  }
  .code-icon {
    color: var(--accent-primary);
    font-family: var(--font-mono);
  }
  .nav-menu {
    display: flex;
    gap: 1.5rem;
  }
  .nav-link {
    color: var(--text-secondary);
    font-weight: 500;
    padding: 0.25rem 0;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--accent-primary);
    border-bottom: 2px solid var(--accent-primary);
  }
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Buat `src/components/Footer.astro`**

Tulis `src/components/Footer.astro`:
```astro
---
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container footer-content">
    <p>&copy; {year} Suhendar Aryadi, S.Kom. | Guru Jurusan RPL SMK.</p>
    <p class="tagline">Pendidikan Vokasi IT - Siap Kerja, Santun, Mandiri, Kreatif.</p>
  </div>
</footer>

<style>
  .site-footer {
    border-top: var(--glass-border);
    padding: 2rem 0;
    margin-top: 4rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
  }
  .tagline {
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 4: Buat `src/layouts/MainLayout.astro`**

Tulis `src/layouts/MainLayout.astro`:
```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}

const { 
  title = 'Suhendar Aryadi | Guru RPL SMK', 
  description = 'Portal pembelajaran RPL dan blog pribadi Suhendar Aryadi, S.Kom.' 
} = Astro.props;
---
<!DOCTYPE html>
<html lang="id" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <Header />
    <main class="container page-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  .page-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
    min-height: calc(100vh - 180px);
  }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/layouts/MainLayout.astro
git commit -m "feat: add Header, Footer, ThemeToggle, and MainLayout components"
```

---

### Task 4: Content Collections Schema & Sample Content

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md`
- Create: `src/content/modules/pemrograman-web-dasar-smk.md`

**Interfaces:**
- Consumes: Astro Content Collections Zod Schema
- Produces: Strongly typed `posts` dan `modules` collections

- [ ] **Step 1: Buat `src/content/config.ts`**

Tulis `src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Suhendar Aryadi, S.Kom.'),
    tags: z.array(z.string()),
    category: z.string(),
    featured: z.boolean().default(false),
  })
});

const modulesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subject: z.string(), // e.g. Pemrograman Web, PBO, Basis Data
    grade: z.string(), // e.g. Kelas X, XI, XII
    downloadUrl: z.string().optional(),
    tags: z.array(z.string()),
  })
});

export const collections = {
  posts: postsCollection,
  modules: modulesCollection,
};
```

- [ ] **Step 2: Buat sampel artikel `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md`**

Tulis `src/content/posts/pengenalan-astro-untuk-siswa-rpl.md`:
```markdown
---
title: "Pengenalan Framework Astro v4 untuk Siswa Jurusan RPL"
description: "Panduan belajar framework modern Astro untuk membangun website super cepat dengan Zero Client JS."
pubDate: 2026-08-04
author: "Suhendar Aryadi, S.Kom."
tags: ["Astro", "Web Development", "RPL SMK", "Tutorial"]
category: "Tutorial Code"
featured: true
---

# Mengapa Siswa RPL Perlu Belajar Astro?

Dalam dunia industri pengembangan perangkat lunak (Software Engineering), kecepatan muat situs web (*web performance*) adalah faktor kunci. Framework **Astro** hadir dengan arsitektur pulau (*Island Architecture*) yang memungkinkan kita membuat web modern namun menghasilkan output static HTML tanpa beban JavaScript berlebih.

## Keunggulan Utama Astro:
1. **Zero JS by Default**: Hanya mengirimkan JavaScript ke browser jika dibutuhkan secara eksplisit.
2. **Multi-Framework Support**: Bisa menggabungkan komponen React, Vue, dan Svelte dalam satu proyek.
3. **Content Collections**: Fitur bawaan untuk mengelola file Markdown dengan type-safety berbasis TypeScript.

## Contoh Komponen Astro Sederhana:
```astro
---
const namaSiswa = "Budi";
---
<h2>Selamat Belajar RPL, {namaSiswa}!</h2>
```

Mari kita praktikkan di lab komputer RPL minggu ini!
```

- [ ] **Step 3: Buat sampel modul `src/content/modules/pemrograman-web-dasar-smk.md`**

Tulis `src/content/modules/pemrograman-web-dasar-smk.md`:
```markdown
---
title: "Modul Praktikum Pemrograman Web Dasar (HTML5 & CSS3)"
subject: "Pemrograman Web & Perangkat Bergerak"
grade: "Kelas X RPL"
downloadUrl: "/downloads/modul-web-dasar.pdf"
tags: ["HTML5", "CSS3", "Modul Praktikum", "Dasar Web"]
---

# Deskripsi Modul
Modul ini dirancang khusus untuk siswa kelas X Jurusan Rekayasa Perangkat Lunak (RPL) SMK. Berisi panduan langkah demi langkah pembuatan dokumen HTML5 terstruktur serta penataan gaya menggunakan CSS3 Flexbox dan Grid.

## Capaian Pembelajaran:
- Memahami elemen dasar HTML (heading, paragraph, list, table, form).
- Menyusun layout responsif dengan CSS Flexbox.
- Mengunggah proyek web ke GitHub Pages.
```

- [ ] **Step 4: Verifikasi schema Astro Content Collections**

Run: `npx astro check`
Expected: Collections berhasil divalidasi tanpa error.

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: setup Content Collections schema and sample posts/modules"
```

---

### Task 5: Halaman Beranda, Blog, Materi, Portofolio & Tentang Guru

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
- Produces: Halaman web publik yang lengkap dan interaktif

- [ ] **Step 1: Update `src/pages/index.astro` (Homepage)**

Tulis `src/pages/index.astro`:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const featuredPosts = posts.filter(p => p.data.featured);
const modules = await getCollection('modules');
---
<MainLayout title="Suhendar Aryadi | Guru RPL SMK">
  <!-- Hero Section -->
  <section class="hero glass-card">
    <div class="hero-text">
      <span class="badge">Guru RPL SMK & Tech Educator</span>
      <h1>Halo, Saya <span class="highlight">Suhendar Aryadi, S.Kom.</span></h1>
      <p class="subtitle">
        Selamat datang di portal pembelajaran Rekayasa Perangkat Lunak (RPL) dan blog teknologi saya. Tempat berbagi modul materi, tutorial coding, dan inspirasi bagi calon Software Engineer masa depan!
      </p>
      <div class="hero-cta">
        <a href="/materi" class="btn btn-primary">📚 Lihat Materi RPL</a>
        <a href="/portofolio" class="btn btn-secondary">🚀 Portofolio & Karya</a>
      </div>
    </div>
  </section>

  <!-- Highlight Section -->
  <section class="section">
    <h2>🔥 Artikel & Tutorial Pilihan</h2>
    <div class="grid">
      {featuredPosts.map(post => (
        <a href={`/blog/${post.slug}`} class="glass-card card-link">
          <span class="badge">{post.data.category}</span>
          <h3>{post.data.title}</h3>
          <p>{post.data.description}</p>
          <small class="meta">{post.data.pubDate.toLocaleDateString('id-ID')}</small>
        </a>
      ))}
    </div>
  </section>

  <section class="section">
    <h2>📖 Modul Pembelajaran Terbaru</h2>
    <div class="grid">
      {modules.map(mod => (
        <a href={`/materi/${mod.slug}`} class="glass-card card-link">
          <span class="badge">{mod.data.grade}</span>
          <h3>{mod.data.title}</h3>
          <p>Mata Pelajaran: {mod.data.subject}</p>
        </a>
      ))}
    </div>
  </section>
</MainLayout>

<style>
  .hero {
    padding: 3rem 2rem;
    margin-bottom: 3rem;
  }
  .highlight {
    color: var(--accent-primary);
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    margin: 1rem 0 1.5rem;
    font-size: 1.1rem;
    color: var(--text-secondary);
    max-width: 700px;
  }
  .hero-cta {
    display: flex;
    gap: 1rem;
  }
  .section {
    margin-bottom: 3rem;
  }
  .section h2 {
    margin-bottom: 1.5rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  .card-link h3 {
    margin: 0.5rem 0;
    color: var(--text-primary);
  }
  .card-link p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
  .meta {
    display: block;
    margin-top: 1rem;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Buat Halaman `src/pages/blog/index.astro` & `src/pages/blog/[...slug].astro`**

Tulis `src/pages/blog/index.astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
---
<MainLayout title="Blog & Tutorial | Suhendar Aryadi">
  <h1>Blog & Tutorial Pemrograman</h1>
  <p class="subtitle">Artikel teknikal, tips belajar RPL, dan pembaruan seputar dunia software engineering.</p>
  
  <div class="grid" style="margin-top: 2rem;">
    {posts.map(post => (
      <a href={`/blog/${post.slug}`} class="glass-card card-link">
        <span class="badge">{post.data.category}</span>
        <h2>{post.data.title}</h2>
        <p>{post.data.description}</p>
        <small>{post.data.pubDate.toLocaleDateString('id-ID')}</small>
      </a>
    ))}
  </div>
</MainLayout>

<style>
  .subtitle { color: var(--text-secondary); }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .card-link h2 { margin: 0.5rem 0; font-size: 1.3rem; }
</style>
```

Tulis `src/pages/blog/[...slug].astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<MainLayout title={`${post.data.title} | Suhendar Aryadi`}>
  <article class="glass-card article-container">
    <span class="badge">{post.data.category}</span>
    <h1>{post.data.title}</h1>
    <p class="meta">Oleh {post.data.author} • {post.data.pubDate.toLocaleDateString('id-ID')}</p>
    <hr class="divider" />
    <div class="prose">
      <Content />
    </div>
  </article>
</MainLayout>

<style>
  .article-container { padding: 2.5rem; }
  .meta { color: var(--text-muted); margin: 0.5rem 0 1.5rem; }
  .divider { border: 0; height: 1px; background: var(--border-color); margin-bottom: 2rem; }
  .prose :global(h1), .prose :global(h2), .prose :global(h3) { margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--text-primary); }
  .prose :global(p) { margin-bottom: 1.25rem; color: var(--text-secondary); }
  .prose :global(pre) { padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; overflow-x: auto; }
</style>
```

- [ ] **Step 3: Buat Halaman `src/pages/materi/index.astro` & `src/pages/materi/[...slug].astro`**

Tulis `src/pages/materi/index.astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import { getCollection } from 'astro:content';

const modules = await getCollection('modules');
---
<MainLayout title="Materi Pembelajaran RPL | Suhendar Aryadi">
  <h1>Portal Materi Pembelajaran RPL SMK</h1>
  <p class="subtitle">Modul, handout praktikum, dan panduan belajar untuk siswa Rekayasa Perangkat Lunak.</p>
  
  <div class="grid" style="margin-top: 2rem;">
    {modules.map(mod => (
      <a href={`/materi/${mod.slug}`} class="glass-card card-link">
        <span class="badge">{mod.data.grade}</span>
        <h2>{mod.data.title}</h2>
        <p>Mata Pelajaran: <strong>{mod.data.subject}</strong></p>
      </a>
    ))}
  </div>
</MainLayout>

<style>
  .subtitle { color: var(--text-secondary); }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .card-link h2 { margin: 0.5rem 0; font-size: 1.3rem; }
</style>
```

Tulis `src/pages/materi/[...slug].astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const modules = await getCollection('modules');
  return modules.map(mod => ({
    params: { slug: mod.slug },
    props: { mod },
  }));
}

const { mod } = Astro.props;
const { Content } = await mod.render();
---
<MainLayout title={`${mod.data.title} | Materi RPL`}>
  <article class="glass-card article-container">
    <span class="badge">{mod.data.grade}</span>
    <h1>{mod.data.title}</h1>
    <p class="meta">Mata Pelajaran: {mod.data.subject}</p>
    {mod.data.downloadUrl && (
      <a href={mod.data.downloadUrl} target="_blank" class="btn btn-primary download-btn">
        📥 Unduh Modul PDF
      </a>
    )}
    <hr class="divider" />
    <div class="prose">
      <Content />
    </div>
  </article>
</MainLayout>

<style>
  .article-container { padding: 2.5rem; }
  .meta { color: var(--text-muted); margin: 0.5rem 0 1rem; }
  .download-btn { margin-bottom: 1.5rem; }
  .divider { border: 0; height: 1px; background: var(--border-color); margin-bottom: 2rem; }
  .prose :global(h1), .prose :global(h2), .prose :global(h3) { margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--text-primary); }
  .prose :global(p) { margin-bottom: 1.25rem; color: var(--text-secondary); }
</style>
```

- [ ] **Step 4: Buat `src/pages/portofolio.astro` & `src/pages/tentang.astro`**

Tulis `src/pages/portofolio.astro`:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';

const studentProjects = [
  { title: "Sistem Informasi Perpustakaan SMK", student: "Tim Siswa RPL Kelas XI", desc: "Aplikasi berbasis Web PHP Laravel & MySQL untuk manajemen peminjaman buku.", tag: "Web App" },
  { title: "Aplikasi Kasir Toko Vokasi", student: "Siswa Tugas Akhir XII", desc: "Sistem POS Point of Sale dengan fitur cetak struk & laporan stok.", tag: "Desktop / Web" },
];
---
<MainLayout title="Portofolio & Karya Siswa | Suhendar Aryadi">
  <h1>Showcase Karya & Portofolio</h1>
  <p class="subtitle">Apresiasi proyek inovatif karya siswa RPL SMK dan hasil karya pembelajaran guru.</p>

  <div class="grid" style="margin-top: 2rem;">
    {studentProjects.map(proj => (
      <div class="glass-card">
        <span class="badge">{proj.tag}</span>
        <h2 style="margin: 0.5rem 0; font-size: 1.25rem;">{proj.title}</h2>
        <p style="color: var(--text-secondary);">{proj.desc}</p>
        <small style="color: var(--accent-primary); display: block; margin-top: 1rem;">Oleh: {proj.student}</small>
      </div>
    ))}
  </div>
</MainLayout>

<style>
  .subtitle { color: var(--text-secondary); }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
</style>
```

Tulis `src/pages/tentang.astro`:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
---
<MainLayout title="Tentang Suhendar Aryadi | Guru RPL SMK">
  <div class="glass-card" style="padding: 2.5rem;">
    <h1>Profil Suhendar Aryadi, S.Kom.</h1>
    <p class="subtitle" style="margin-top: 0.5rem;">Guru Jurusan Rekayasa Perangkat Lunak (RPL) SMK</p>
    <hr style="border: 0; height: 1px; background: var(--border-color); margin: 1.5rem 0;" />
    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
      Saya adalah seorang tenaga pendidik berdedikasi di bidang Rekayasa Perangkat Lunak (RPL) SMK. Berfokus pada pembimbingan siswa untuk menguasai keterampilan pemrograman modern, pengujian perangkat lunak, hingga siap bersaing di industri teknologi maupun wirausaha digital.
    </p>
    <h2>Fokus Pengajaran & Kompetensi:</h2>
    <ul style="margin-left: 1.5rem; color: var(--text-secondary); margin-top: 0.5rem;">
      <li>Pemrograman Web Dasar & Lanjutan (HTML, CSS, JavaScript, Astro, Laravel)</li>
      <li>Pemrograman Berorientasi Objek (PBO / Java)</li>
      <li>Desain & Basis Data (MySQL, PostgreSQL)</li>
      <li>Git & Version Control Workflow</li>
    </ul>
  </div>
</MainLayout>
```

- [ ] **Step 5: Verifikasi build halaman**

Run: `npx astro build`
Expected: Seluruh halaman (`/`, `/blog`, `/blog/[slug]`, `/materi`, `/materi/[slug]`, `/portofolio`, `/tentang`) terkompilasi dengan sukses.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: implement all public pages (home, blog, materi, portofolio, tentang)"
```

---

### Task 6: Custom Copy Code Button for Code Blocks

**Files:**
- Modify: `src/layouts/MainLayout.astro`

**Interfaces:**
- Consumes: Shiki code block elements `<pre>`
- Produces: Tombol copy code interaktif pada setiap blok kode tutorial

- [ ] **Step 1: Tambahkan script Copy Code Button di `src/layouts/MainLayout.astro`**

Tambahkan `<script>` sebelum `</body>` pada `src/layouts/MainLayout.astro`:
```astro
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.innerText = '📋 Copy';
      
      button.addEventListener('click', async () => {
        const code = block.querySelector('code')?.innerText || block.innerText;
        await navigator.clipboard.writeText(code);
        button.innerText = '✅ Copied!';
        setTimeout(() => { button.innerText = '📋 Copy'; }, 2000);
      });

      block.style.position = 'relative';
      block.appendChild(button);
    });
  });
</script>

<style is:global>
  .copy-code-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: var(--glass-border);
    color: var(--text-primary);
    padding: 0.25rem 0.6rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.2s ease;
  }
  .copy-code-btn:hover {
    background: var(--accent-primary);
    color: #ffffff;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/MainLayout.astro
git commit -m "feat: add copy code button for code blocks in tutorials"
```

---

### Task 7: Build Verification & Final Check

**Files:**
- Check: All files in repository

- [ ] **Step 1: Jalankan `npm run build`**

Run: `npm run build`
Expected: Build sukses tanpa error dan folder `dist/` tercipta dengan lengkap.

- [ ] **Step 2: Jalankan `npx astro check`**

Run: `npx astro check`
Expected: Result: 0 errors, 0 warnings.

- [ ] **Step 3: Commit akhir**

```bash
git commit --allow-empty -m "chore: verify final build and production readiness"
```
