# Web Suhendar Aryadi — Portal Pembelajaran RPL SMK & Platform SQL Interaktif

![Astro](https://img.shields.io/badge/Astro-v4.10-orange?style=flat-square&logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Neon Postgres](https://img.shields.io/badge/Database-Neon_Postgres-00e599?style=flat-square&logo=postgresql)
![SQLite WASM](https://img.shields.io/badge/Sandbox-SQLite_WASM-003B57?style=flat-square&logo=sqlite)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)

Portal edukasi resmi dan platform pembelajaran interaktif yang dikembangkan oleh **Suhendar Aryadi, S.Pd.,Gr.** (Guru Rekayasa Perangkat Lunak SMK). Platform ini memadukan materi vokasi IT, blog tutorial web development, serta **Platform Belajar SQL Interaktif 40 Modul** lengkap dengan sistem evaluasi dual-mode dan dashboard progres siswa.

🌐 **Live Website**: [https://suhendar-aryadi-blog.vercel.app](https://suhendar-aryadi-blog.vercel.app)

---

## 🌟 Fitur Utama

### 1. 🗄️ Platform Belajar SQL Interaktif (40 Modul)
- **Kurikulum Terstruktur (5 Learning Paths)**:
  1. **Path 1: SQL Basics** (Modul 1 – 10): `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, `DELETE`.
  2. **Path 2: SQL Aggregates & Functions** (Modul 11 – 18): `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LIKE`, `IN`, `BETWEEN`, String & Date.
  3. **Path 3: SQL Joins & Relasi Tabel** (Modul 19 – 24): `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `Self Join`.
  4. **Path 4: SQL Grouping & Subqueries** (Modul 25 – 30): `GROUP BY`, `HAVING`, `Subqueries`, `EXISTS`, `ANY/ALL`, `UNION`.
  5. **Path 5: SQL DDL, Constraints & Security** (Modul 31 – 40): `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `DEFAULT`, `CREATE INDEX`, `AUTOINCREMENT`, `VIEWS`, `SQL Injection`.

- **Dual-Mode Evaluator Sandbox**:
  - **`data_match`**: Mengevaluasi hasil eksekusi kueri `SELECT` berdasarkan kecocokan baris data & tipe data hasil.
  - **`schema_match`**: Mengevaluasi kueri DDL (`CREATE`, `ALTER`, `DROP`) dengan memeriksa struktur katalog database SQLite (`sqlite_master` dan `PRAGMA table_info`) secara fleksibel & *case-insensitive*.
  - **Client & Server SQLite WASM Sandbox**: Eksekusi kueri cepat secara in-memory menggunakan `sql.js`.

### 2. 📊 Student Dashboard (`/dashboard`)
- **Sistem Peringkat 4-Tier**:
  - 🟢 **SQL Novice** (1 – 10 Modul)
  - 🟡 **SQL Intermediate** (11 – 24 Modul)
  - 🔵 **SQL Advanced** (25 – 39 Modul)
  - 🏆 **Master SQL Engineer** (40 Modul Selesai Tuntas)
- **Analitik Progress Per Path**: Breakdown visual pencapaian modul di masing-masing dari 5 alur belajar.
- **Riwayat Modul Diselesaikan**: Tabel detail berisi tanggal penyelesaian, kueri SQL terakhir yang disubmit, dan tautan untuk mengulang latihan.

### 3. 🔐 Sistem Autentikasi Siswa
- Fitur Pendaftaran (*Register*), Masuk (*Login*), dan Keluar (*Logout*).
- Password dienkripsi menggunakan `bcryptjs`.
- Manajemen sesi berbasis secure HTTP-only session cookies yang tersimpan di Neon Postgres.

### 4. 📚 Portal Publik & Media Pembelajaran RPL
- **Blog & Tutorial**: Berbagi wawasan teknis dan panduan pemrograman web modern.
- **Modul Pembelajaran SMK**: Bahan ajar terstruktur untuk siswa RPL (Pemrograman Web, Basis Data, PBO, Pemrograman Bergerak).
- **Portofolio & Profile Guru**: Profil vokasi dan etalase karya.
- **Desain Clean & Aksesibel**: Tipografi **Inter** & **JetBrains Mono**, tema otomatis Light/Dark mode, serta tombol salin kode snippet.

---

## 🏗️ Arsitektur & Teknologi

| Komponen | Teknologi yang Digunakan |
|---|---|
| **Framework Web** | [Astro v4](https://astro.build) (SSR Serverless Mode via `@astrojs/vercel`) |
| **Bahasa Pemrograman** | TypeScript / JavaScript (ESM) |
| **Database Produksi** | [Neon Postgres](https://neon.tech) (Serverless PostgreSQL via `@vercel/postgres`) |
| **SQL Execution Engine** | `sql.js` (SQLite compiled to WebAssembly / WASM) |
| **Code Editor** | [CodeMirror 6](https://codemirror.net) (`@codemirror/lang-sql`) |
| **Design System** | Custom Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid) |
| **Typography** | Google Fonts (Inter & JetBrains Mono) |
| **Search Engine** | [Pagefind](https://pagefind.app) Static Search |
| **Hosting & Deployment** | [Vercel](https://vercel.com) (Node.js 22.x Runtime) |

---

## 🗄️ Skema Database (Neon Postgres)

```sql
-- Tabel Pengguna (Siswa & Admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Modul/Soal Latihan SQL
CREATE TABLE IF NOT EXISTS sql_lessons (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  path_id VARCHAR(50) DEFAULT 'basics',
  evaluator_type VARCHAR(50) DEFAULT 'data_match',
  order_index INT NOT NULL,
  instructions_markdown TEXT NOT NULL,
  initial_sql TEXT NOT NULL,
  solution_sql TEXT NOT NULL,
  expected_output_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Progres Pembelajaran Siswa
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
Cloning repository dan install seluruh dependensi proyek:
```bash
git clone https.github.com/suhendararyadi/suhendar-aryadi-blog.git
cd suhendar-aryadi-blog
npm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat file `.env.local` di root direktori proyek dan isi koneksi Neon Postgres:
```env
POSTGRES_URL="postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NON_POOLING="postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-key-here"
```

### 4. Jalankan Migrasi & Seed Data 40 Modul SQL
Untuk membuat tabel di database dan mengisi 40 modul kurikulum SQL:
```bash
npx tsx scripts/migrate.js
```

### 5. Jalankan Server Dev Local
```bash
npm run dev
```
Buka browser di `http://localhost:4321`.

### 6. Build Produksi & Verifikasi
```bash
npm run build
```

---

## 📁 Struktur Direktori Proyek

```text
├── .superpowers/           # Dokumentasi perencanaan & SDD task briefs
├── docs/                   # Dokumentasi teknis & arsitektur proyek
├── public/                 # Static assets (favicon, images)
├── scripts/
│   └── migrate.js          # Script migrasi tabel database & seeding 40 modul SQL
├── src/
│   ├── components/         # Komponen Astro (Header, Footer, ThemeToggle)
│   ├── content/            # Content Collections (Blog posts & Modul RPL)
│   ├── layouts/            # Layout utama (MainLayout.astro)
│   ├── lib/
│   │   ├── auth.ts         # Session management & password hashing
│   │   ├── db.ts           # Koneksi Pool Neon Postgres
│   │   ├── seedLessons.ts  # Definisi 40 Modul Kurikulum SQL W3Schools
│   │   └── sqlEvaluator.ts # Evaluator Sandbox (data_match & schema_match)
│   ├── pages/
│   │   ├── api/            # API Routes (Auth register/login/logout, SQL execute/evaluate)
│   │   ├── auth/           # Halaman Login & Register
│   │   ├── belajar/sql/    # Katalog Modul SQL & Split-Screen Workspace [slug].astro
│   │   ├── blog/           # Halaman Blog & Artikel Tutorial
│   │   ├── materi/         # Halaman Modul Pembelajaran RPL SMK
│   │   ├── dashboard.astro # Student Dashboard (Rank & 5 Learning Paths)
│   │   ├── portofolio.astro# Halaman Portofolio Karya
│   │   └── tentang.astro   # Profil Guru RPL SMK
│   └── styles/
│       └── global.css      # Design System CSS, variabel warna, Inter font
├── astro.config.mjs        # Konfigurasi Astro SSR & Vercel Adapter
├── package.json            # Script build & dependensi NPM
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## 📄 Lisensi & Hak Cipta

© 2026 **Suhendar Aryadi, S.Kom.** All Rights Reserved.  
Dikembangkan untuk mendukung pendidikan vokasi Rekayasa Perangkat Lunak (RPL) SMK di Indonesia.
