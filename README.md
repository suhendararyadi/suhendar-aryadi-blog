# Web Suhendar Aryadi — Portal Pembelajaran RPL SMK, LKPD Digital & Platform SQL Interaktif

![Astro](https://img.shields.io/badge/Astro-v4.10-orange?style=flat-square&logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Material UI](https://img.shields.io/badge/UI_System-Material_UI-007FFF?style=flat-square&logo=mui)
![Neon Postgres](https://img.shields.io/badge/Database-Neon_Postgres-00e599?style=flat-square&logo=postgresql)
![SQLite WASM](https://img.shields.io/badge/Sandbox-SQLite_WASM-003B57?style=flat-square&logo=sqlite)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)

Portal edukasi resmi dan platform pembelajaran interaktif yang dikembangkan oleh **Suhendar Aryadi, S.Pd.,Gr.** (Guru Rekayasa Perangkat Lunak SMK). Platform ini memadukan materi vokasi IT, blog tutorial web development, lembar kerja siswa (LKPD Digital BK & TIK), **Platform Belajar SQL Interaktif 40 Modul**, serta **Dashboard Siswa berbasis Material UI (MUI)**.

🌐 **Live Website**: [https://www.suhendararyadi.com](https://www.suhendararyadi.com)  
🎓 **Dashboard Siswa**: [https://www.suhendararyadi.com/dashboard](https://www.suhendararyadi.com/dashboard)

---

## 🌟 Fitur Utama & Sistem Terbaru

### 1. 🎨 Student Dashboard Berbasis Material UI (MUI Design System)
- **Paper & Elevation Card Architecture**: Mengadopsi prinsip desain Material UI dengan visual clean, modern, dan edukatif untuk siswa SMK.
- **Hero Profile Header**: Menampilkan avatar inisial, chip role, chip kelas rombel, chip peringkat platform, predikat kualifikasi, serta aksi cepat (Edit Profil, Leaderboard, Sertifikat).
- **4 MUI Quick Metrics Cards**:
  - 📊 Progres Penyelesaian Modul SQL (40 Modul).
  - 🎯 Rata-Rata Nilai Akademik LKPD Informatika (`/100`).
  - 🏆 Peringkat Platform & Predikat Kualifikasi.
  - 👥 Peringkat Siswa Khusus di Rombel/Kelas.
- **Subject-Level Grade Recap Cards**: Card khusus Mata Pelajaran **Informatika SMK (Fase E)** dan **Pemrograman Web & Basis Data (RPL)** lengkap dengan rekap nilai LKPD, feedback Guru, dan tombol enroll/akses.

### 2. 🆔 Sistem Identitas Kelas Wajib Siswa (Rombel SMK)
- **Mandatory Class Rules**: Setiap akun siswa wajib memiliki identitas kelas terdaftar (`10 RPL 1-4`, `11 RPL 1-4`, `12 RPL 1-4`).
- **Intersepsi Login & Register**: Form pendaftaran dan intersepsi login (Step 2) secara otomatis mewajibkan siswa yang belum mengatur kelas untuk memilih rombel sebelum masuk ke modul belajar.
- **SSR Protection**: Pengguna siswa yang tidak memiliki data kelas akan secara otomatis di-*force logout* dan diarahkan ke `/auth/login?reason=missing_class`.

### 3. 🔑 Skema Enrollment Mata Pelajaran (Access Code System)
- **Subject-Level Access Code**: Siswa cukup melakukan *enrollment* sekali pada tingkat Mata Pelajaran untuk membuka seluruh modul di dalamnya.
- **Kode Akses Resmi**:
  - **Informatika SMK (Fase E)**: `INFORMATIKA2026` (atau `INF2026`, `BK2026`, `TIK2026`)
  - **Pemrograman Web & Basis Data (RPL)**: `RPL2026` (atau `SQL2026`, `BASISDATA2026`, `WEB2026`)
  - **Pemrograman Berbasis Objek (PBO)**: `PBO2026`

### 4. 🗄️ Platform Belajar SQL Interaktif (40 Modul W3Schools)
- **5 Learning Paths Terstruktur**:
  1. **Path 1: SQL Basics** (Modul 1 – 10): `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, `DELETE`.
  2. **Path 2: Aggregates & Functions** (Modul 11 – 18): `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LIKE`, `IN`, `BETWEEN`.
  3. **Path 3: Joins & Relasi Tabel** (Modul 19 – 24): `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `Self Join`.
  4. **Path 4: Grouping & Subqueries** (Modul 25 – 30): `GROUP BY`, `HAVING`, `EXISTS`, `ANY/ALL`, `UNION`.
  5. **Path 5: DDL, Constraints & Security** (Modul 31 – 40): `CREATE`, `ALTER`, `DROP`, `PK/FK`, `INDEX`, `VIEWS`, `SQL Injection`.
- **Dual-Mode Evaluator Sandbox**: Evaluasi otomatis kueri `data_match` (DML) dan `schema_match` (DDL) berbasis SQLite WASM (`sql.js`).

### 5. 📑 Lembar Kerja Peserta Didik (LKPD Digital BK & TIK)
- **LKPD 1 — Berpikir Komputasional (BK)**: Form kerja kelompok 4 pilar (Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma).
- **LKPD 2 — TIK & Mail Merge**: Form kerja kelompokMail Merge & Search Engine Operators.
- **Portal Penilaian Guru (`/admin/lkpd`)**: Tab filter dual LKPD, drawer detail jawaban kelompok, modal grading nilai + feedback, serta fitur ekspor data nilai ke CSV.

### 6. ⚓ Dock.cool Floating macOS Smart Dock Footer
- Navigation bar melayang ala macOS Dock di bagian bawah layar dengan ikon pintasan cepat, indikator status sistem online, dan grid informasi 4 kolom.

---

## 🏗️ Arsitektur & Teknologi

| Komponen | Teknologi |
|---|---|
| **Framework Web** | [Astro v4](https://astro.build) (SSR Serverless Mode via `@astrojs/vercel`) |
| **UI Component Library** | [Material UI (MUI)](https://mui.com) (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`) |
| **Model Context Protocol** | MUI MCP Server (`@mui/mcp@latest`) |
| **Database Produksi** | [Neon Postgres](https://neon.tech) (Serverless PostgreSQL via `@vercel/postgres`) |
| **SQL Execution Engine** | `sql.js` (SQLite compiled to WebAssembly / WASM) |
| **Code Editor** | [CodeMirror 6](https://codemirror.net) (`@codemirror/lang-sql`) |
| **Footer Navigation** | macOS Dock Inspired Floating Navigation Bar |
| **Search Engine** | [Pagefind](https://pagefind.app) Static Search |
| **Hosting & Deployment** | [Vercel](https://vercel.com) (Node.js 22.x Runtime) |

---

## 🗄️ Skema Database (Neon Postgres)

```sql
-- Tabel Pengguna (Siswa & Guru/Admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  class_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Enrollment Mata Pelajaran
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Tabel LKPD 1 Berpikir Komputasional (BK)
CREATE TABLE IF NOT EXISTS lkpd_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  case_study_id VARCHAR(100) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  team_members TEXT NOT NULL,
  decomposition_json TEXT,
  pattern_json TEXT,
  abstraction_json TEXT,
  algorithm_json TEXT,
  score INT,
  teacher_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel LKPD 2 TIK (Mail Merge & Search Engine)
CREATE TABLE IF NOT EXISTS lkpd_tik_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  case_study_id VARCHAR(100) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  team_members TEXT NOT NULL,
  mail_merge_json TEXT,
  search_operators_json TEXT,
  reflection_json TEXT,
  score INT,
  teacher_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Progres Pembelajaran SQL
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES sql_lessons(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  submitted_code TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

---

## 🚀 Panduan Lokal (Getting Started)

### 1. Prasyarat
- **Node.js**: Version 20.x atau 22.x
- **npm**: Version 10+

### 2. Instalasi
```bash
git clone https://github.com/suhendararyadi/suhendar-aryadi-blog.git
cd suhendar-aryadi-blog
npm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
```env
POSTGRES_URL="postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NON_POOLING="postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-key-here"
```

### 4. Jalankan Migrasi Database & Seeding
```bash
npx tsx scripts/migrate.js
```

### 5. Jalankan Server Dev Local
```bash
npm run dev
```
Akses di browser `http://localhost:4321`.

### 6. Build Produksi & Deploy Vercel CLI
```bash
npm run build
npx vercel --prod --yes
```

---

## 📁 Struktur Direktori Proyek

```text
├── .agents/                # Konfigurasi MCP Agent (mui-mcp, astro-docs, context7)
├── .superpowers/           # Dokumentasi perencanaan & SDD task briefs
├── docs/                   # Dokumentasi teknis & arsitektur proyek
├── public/                 # Static assets
├── scripts/
│   └── migrate.js          # Script migrasi tabel Postgres & seeding modul SQL
├── src/
│   ├── components/         # Komponen Astro (Header, Footer Smart Dock, ThemeToggle)
│   ├── content/            # Content Collections (Blog posts & Modul RPL)
│   ├── layouts/            # Layout utama (MainLayout.astro)
│   ├── lib/
│   │   ├── auth.ts         # Session management & password hashing
│   │   ├── db.ts           # Koneksi Pool Neon Postgres
│   │   ├── seedLessons.ts  # Definisi 40 Modul Kurikulum SQL W3Schools
│   │   └── sqlEvaluator.ts # Evaluator Sandbox (data_match & schema_match)
│   ├── pages/
│   │   ├── admin/          # Teacher Admin Portal (lkpd.astro, dashboard.astro)
│   │   ├── api/            # API Routes (Auth, SQL execute/evaluate, LKPD submit/grade, Course enroll)
│   │   ├── auth/           # Halaman Login & Register (Mandatory Class Step 2)
│   │   ├── belajar/        # Katalog Mata Pelajaran & LKPD Digital Informatika/SQL
│   │   ├── blog/           # Halaman Blog & Artikel Tutorial
│   │   ├── materi/         # Halaman Modul Pembelajaran RPL SMK
│   │   └── dashboard.astro # Student Dashboard MUI Paper & Elevation
│   └── styles/
│       └── global.css      # Design System CSS, variabel warna, Inter font
├── astro.config.mjs        # Konfigurasi Astro SSR & Vercel Adapter
├── package.json            # Script build & dependensi NPM
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## 📄 Lisensi & Hak Cipta

© 2026 **Suhendar Aryadi, S.Pd.,Gr.** All Rights Reserved.  
Dikembangkan untuk mendukung pendidikan vokasi Rekayasa Perangkat Lunak (RPL) SMK di Indonesia.
