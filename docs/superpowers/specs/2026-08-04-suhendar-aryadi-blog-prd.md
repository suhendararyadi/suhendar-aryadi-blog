# Product Requirement Document (PRD): Web Blog & Edutech Personal - Suhendar Aryadi (Guru RPL SMK)

- **Owner**: Suhendar Aryadi
- **Peran**: Guru Jurusan Rekayasa Perangkat Lunak (RPL) di SMK
- **Status**: Draft - Disetujui
- **Tanggal**: 2026-08-04
- **Teknologi**: Astro v4+ (SSG), Markdown/MDX, Pagefind Search, Custom CSS (Dark/Light Mode)

---

## 1. Latar Belakang & Tujuan (Vision & Objective)

### 1.1 Visi
Membangun platform web pribadi modern dan profesional bagi **Suhendar Aryadi**, seorang Guru Jurusan RPL di SMK. Platform ini berfungsi ganda sebagai **Portal Pembelajaran RPL Interaktif** untuk siswa dan **Blog Portofolio & Personal Branding** pendidik IT di era digital.

### 1.2 Tujuan Utama
1. **Pusat Materi Pembelajaran**: Memudahkan siswa RPL mengakses modul, handout, tugas, dan tutorial pemrograman secara terstruktur.
2. **Personal Branding Guru**: Menampilkan profil, kompetensi, pengalaman mengajar, serta kontribusi dalam dunia pendidikan vokasi IT.
3. **Showcase Karya**: Wadah untuk mengapresiasi karya proyek terbaik siswa RPL dan portofolio karya pengajaran guru.
4. **Performa & Aksesibilitas Tinggi**: Menggunakan Astro agar situs memiliki kecepatan muat cepat (100/100 Lighthouse performance), SEO friendly, dan hemat kuota bagi siswa.

---

## 2. Target Pengguna (User Persona)

| Persona | Deskripsi | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Siswa RPL SMK** | Siswa aktif jurusan RPL | Mencari modul materi, tutorial coding, latihan soal, serta pengumpulan/informasi tugas |
| **Alumni & Komunitas** | Alumni SMK RPL & Pembelajar Pemula | Membaca artikel teknikal, pembaruan teknologi, dan referensi karir di industri software |
| **Industri & Sekolah** | Pihak IDUKA (Industri & Dunia Kerja), Kepala Sekolah, Rekan Guru | Meninjau kompetensi guru, hasil proyek siswa, serta potensi kerja sama vokasi |

---

## 3. Fitur Utama & Kebutuhan Fungsional (Core Features)

### 3.1 Halaman Beranda (Homepage / Landing Page)
- **Hero Section**:
  - Foto profil profesional, nama & gelar (*Suhendar Aryadi, S.Kom.*), serta deskripsi singkat peran sebagai Guru RPL SMK.
  - Call-To-Action (CTA) cepat: `[Lihat Materi RPL]` & `[Portofolio & Karya]`.
  - Stats Pill Counter (contoh: *10+ Modul RPL*, *50+ Artikel Code*, *100+ Siswa Terdidik*).
- **Featured Materials & Recent Articles**:
  - Carousel / Card Grid menampilkan materi RPL terbaru dan artikel pilihan.
- **Student & Teacher Showcase Highlight**:
  - Preview 3-4 proyek unggulan buatan siswa dan karya pengajaran.

### 3.2 Modul & Pembelajaran RPL (Course Hub)
- Skema terstruktur berdasarkan mata pelajaran RPL (contoh: *Pemrograman Web & Perangkat Bergerak*, *PBO*, *Basis Data*, *Pemodelan Perangkat Lunak*).
- Fitur download handout/modul (PDF / link repository GitHub).
- Indikator tingkat kesulitan (*Beginner*, *Intermediate*, *Advanced*).

### 3.3 Blog & Tutorial Pemrograman (Articles & MDX)
- Integrasi **Astro Content Collections** dengan schema validasi ketat (title, date, tags, category, summary, coverImage).
- **Code Syntax Highlighting** dengan dukungan copy button 1-click.
- Navigasi artikel: waktu baca (*read time*), tanggal rilis, estimasi kelas/tingkat, daftar isi (*Table of Contents*).

### 3.4 Sistem Pencarian & Filter (Search & Navigation)
- Integrasi **Pagefind Search** (pencarian static instant di sisi client).
- Filtering artikel & modul berdasarkan Tag/Kategori (*HTML/CSS*, *JavaScript*, *Laravel*, *Git*, *Sistem Informasi*, *Tips Belajar*).

### 3.5 Estetika & User Experience (UI/UX)
- **Dark Mode / Light Mode Switcher**:
  - Toggle dengan efek transisi halus.
  - Palet warna berkelas (Slate Dark `#0f172a` dengan aksen Indigo/Cyan `#6366f1` / `#06b6d4`).
- **Responsif & Mobile First**: Nyaman dibuka dari smartphone siswa maupun laptop.

---

## 4. Arsitektur Teknis & Struktur Data

### 4.1 Tech Stack
- **Framework**: Astro (v4.x)
- **Styling**: Vanilla CSS / Scoped CSS dengan variabel CSS kustom & Glassmorphism
- **Content Management**: Astro Content Collections (`src/content/config.ts`)
- **Search**: Pagefind static search library
- **Icons**: Lucide Icons / Astro-Icon

### 4.2 Struktur Folder Proyek
```
/
├── public/
│   ├── favicon.svg
│   └── downloads/        # PDF modul & handout
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   ├── HeroSection.astro
│   │   ├── ArticleCard.astro
│   │   ├── ModuleCard.astro
│   │   ├── CodeBlock.astro
│   │   └── SearchBar.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── posts/        # Artikel blog (.md / .mdx)
│   │   └── modules/      # Modul pembelajaran RPL (.md / .mdx)
│   ├── layouts/
│   │   ├── MainLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/index.astro
│   │   ├── blog/[...slug].astro
│   │   ├── materi/index.astro
│   │   ├── materi/[...slug].astro
│   │   ├── portofolio.astro
│   │   └── tentang.astro
│   └── styles/
│       └── global.css    # Design tokens & dark/light mode
└── astro.config.mjs
```

---

## 5. Rencana Pengujian & Kriteria Keberhasilan (Non-Functional Requirements)

1. **Kecepatan & Kinerja**: Score Lighthouse > 90 pada Performance, Accessibility, Best Practices, dan SEO.
2. **Kemudahan Pemeliharaan**: Guru dapat menambah artikel atau modul baru cukup dengan membuat file `.md` atau `.mdx` baru di folder content.
3. **Bebas Error Build**: Proses `npx astro build` berjalan bersih tanpa peringatan skema.

---

## 6. Tahapan Eksekusi (Implementation Roadmap)

- **Fase 1**: Inisialisasi proyek Astro v4 & Struktur Folder.
- **Fase 2**: Pembuatan Design System (`global.css`, CSS variables, Theme Switcher).
- **Fase 3**: Konfigurasi Content Collections & Komponen Dasar (Layout, Header, Footer).
- **Fase 4**: Pembuatan Halaman Beranda, Blog, Detail Artikel, & Modul Materi.
- **Fase 5**: Integrasi Pencarian Pagefind & Syntax Highlighting.
- **Fase 6**: Polishing, SEO Optimization, Audit Lighthouse, & Final Review.
