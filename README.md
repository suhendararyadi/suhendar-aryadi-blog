# Web Suhendar Aryadi — Portal Pembelajaran RPL SMK, LKPD Digital & Platform SQL Interaktif

![Astro](https://img.shields.io/badge/Astro-v4.10-orange?style=flat-square&logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Neon Postgres](https://img.shields.io/badge/Database-Neon_Postgres-00e599?style=flat-square&logo=postgresql)
![SQLite WASM](https://img.shields.io/badge/Sandbox-SQLite_WASM-003B57?style=flat-square&logo=sqlite)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)

Portal edukasi resmi dan platform pembelajaran interaktif yang dikembangkan oleh **Suhendar Aryadi, S.Pd.,Gr.** (Guru Rekayasa Perangkat Lunak SMK). Platform ini memadukan materi vokasi IT, blog tutorial web development, lembar kerja siswa (LKPD Digital BK & TIK), **Platform Belajar SQL Interaktif 40 Modul**, serta **Dashboard Rekap Nilai Siswa per Mata Pelajaran**.

🌐 **Live Website**: [https://www.suhendararyadi.com](https://www.suhendararyadi.com)  
🎓 **Dashboard Siswa**: [https://www.suhendararyadi.com/dashboard](https://www.suhendararyadi.com/dashboard)

---

## 🌟 Fitur Utama & Sistem Aktif

### 1. 📊 Student Dashboard & Rekap Nilai per Mata Pelajaran (`/dashboard`)
- **Profile Header**: Avatar inisial siswa, badge role, badge rombel terdaftar, badge peringkat platform, dan predikat kualifikasi (`Master SQL Engineer`, `SQL Advanced`, `SQL Intermediate`, `SQL Novice`).
- **Subject-Level Grade Recap Cards**:
  - **Informatika SMK (Fase E)**: Rekap nilai LKPD 1 (BK 4 Pilar), LKPD 2 (TIK Mail Merge), umpan balik Guru, dan badge **Rata-Rata Nilai Mata Pelajaran** (`/100`).
  - **Pemrograman Web & Basis Data (RPL)**: Rekap 40 Modul SQL Masterclass & kualifikasi predikat.
- **Sistem Sertifikat Kompetensi**: Fitur pratinjau & cetak sertifikat resmi saat siswa menuntaskan 40 modul SQL.

### 2. 🆔 Sistem Identitas Kelas Wajib Siswa (Rombel SMK)
- **Aturan Rombel Wajib**: Setiap akun siswa wajib memiliki identitas kelas terdaftar (`10 RPL 1-4`, `11 RPL 1-4`, `12 RPL 1-4`).
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
- **LKPD 2 — TIK & Mail Merge**: Form kerja kelompok Mail Merge & Search Engine Operators.
- **Portal Penilaian Guru (`/admin/lkpd`)**: Tab filter dual LKPD, drawer detail jawaban kelompok, modal grading nilai + feedback, serta fitur ekspor data nilai ke CSV.

### 6. 🛡️ Ujian Evaluasi Resmi SQL (CBT 30 Soal) & Anti-Cheat Berlapis (`/belajar/sql/ujian`)
- **Standar Ujian Evaluasi Sumatif SMK RPL**: 30 butir soal pilihan ganda 5 opsi (A, B, C, D, E), alokasi waktu 60 menit dengan hitung mundur otomatis, dan ambang batas KKM 75/100.
- **High-Security Anti-Cheat & 3-Stage Lockout**:
  - Wajib Layar Penuh (*Fullscreen Mode*) & blokir menu konteks (*Right Click*), shortcut inspeksi (F12, DevTools, Ctrl+Shift+I), dan clipboard (*Copy/Paste*).
  - **Tahap 1**: Peringatan keras saat siswa meminimalkan window, berganti tab, atau keluar fullscreen.
  - **Tahap 2**: Penguncian layar 5 menit (*5-Minute Lockout Countdown*). Lembar soal terkunci dan countdown berjalan.
  - **Tahap 3**: Diskualifikasi otomatis sistem dengan nilai 0 dan pencatatan alasan pelanggaran.
- **Mode Uji Coba & Kunci Jawaban Guru**: Akses khusus Guru/Admin untuk mencoba 30 butir soal bebas anti-cheat, membuka pembahasan resmi, dan reset riwayat pengujian.

### 7. 📡 Live Exam Monitoring & Proctor Console Pengawas Guru (`/admin/ujian/monitoring`)
- **Konsol Pengawas Standar CBT / Asesmen Nasional**:
  - Halaman pengawas terdedikasi (`/admin/ujian/monitoring`) siap diproyeksikan ke layar pengawas atau proyektor ruang ujian.
  - **Panel Live Telemetry Terintegrasi**: Tampil langsung di halaman `/belajar/sql/ujian` khusus peran Guru/Admin.
- **Jaminan 100% Zero Disruption**:
  - Sinyal telemetry *heartbeat* berkala (setiap 10 detik) dikirim di latar belakang (*fail-silent*). Gangguan koneksi lab tidak akan memutus atau mereset pengerjaan siswa.
  - Skema database PostgreSQL aditif (`sql_exam_active_sessions`) menjaga keutuhan 100% riwayat nilai yang sedang masuk.
- **Fitur Pengawasan Lengkap**:
  - 6 Metrik KPI Real-Time: Total Peserta, Sedang Mengerjakan, Terkunci 5 Menit, Peringatan Layar, Selesai Dikirim, dan Rata-Rata Nilai.
  - Filter Rombel/Kelas (`11 RPL 1-4`), Filter Status Pengerjaan, dan pencarian instan nama/email siswa.
  - **Remote Unlock (Buka Kunci Layar)**: Guru dapat membuka kunci siswa yang terkena lockout 5 menit secara langsung tanpa siswa perlu me-refresh halaman.
  - **Emergency Reset Sesi**: Reset data ujian siswa jika terjadi kendala teknis PC lab (mati lampu, crash).
  - **Ekspor Data Pengawas (CSV)**: Unduh rekap status live peserta ke format spreadsheet.

### 8. 📋 Dashboard Rekap Nilai Raport Guru & LKPD Softskill (`/admin/dashboard`)
- **Integrasi Nilai Lengkap**: Modul SQL (40 Modul), LKPD 1 (BK 4 Pilar), LKPD 2 (TIK Mail Merge), dan LKPD Softskill (Etika Email Bisnis 3 Studi Kasus).
- **Aturan Ketuntasan Softskill**: Nilai akhir LKPD Softskill hanya dihitung setelah siswa menuntaskan seluruh 3 studi kasus.
- **Format Bersih Raport**: Tampilan nilai integer skala 100 (contoh: `90`) dan tombol unduh rekap nilai raport ke format CSV.

### 9. ⚓ Dock.cool Floating macOS Smart Dock Footer
- Navigation bar melayang ala macOS Dock di bagian bawah layar dengan ikon pintasan cepat, indikator status sistem online, dan grid informasi 4 kolom.

---

## 🏗️ Arsitektur & Teknologi

| Komponen | Teknologi |
|---|---|
| **Framework Web** | [Astro v4](https://astro.build) (SSR Serverless Mode via `@astrojs/vercel`) |
| **Bahasa Pemrograman** | TypeScript / JavaScript (ESM) |
| **Database Produksi** | [Neon Postgres](https://neon.tech) (Serverless PostgreSQL via `@vercel/postgres`) |
| **SQL Execution Engine** | `sql.js` (SQLite compiled to WebAssembly / WASM) |
| **Code Editor** | [CodeMirror 6](https://codemirror.net) (`@codemirror/lang-sql`) |
| **Design System** | Custom Vanilla CSS (Glassmorphism, Dark Mode, Responsive Grid) |
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

-- Tabel LKPD Softskill (Etika Email Bisnis)
CREATE TABLE IF NOT EXISTS lkpd_email_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  case_study_id VARCHAR(50) NOT NULL,
  recipient_to VARCHAR(255) NOT NULL,
  recipient_cc VARCHAR(255) DEFAULT '',
  subject_text TEXT NOT NULL,
  body_text TEXT NOT NULL,
  attachment_name VARCHAR(255) DEFAULT '',
  attachment_link TEXT DEFAULT '',
  score INT DEFAULT NULL,
  teacher_feedback TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Riwayat Nilai Ujian Evaluasi SQL (CBT 30 Soal)
CREATE TABLE IF NOT EXISTS sql_exam_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token_used VARCHAR(50) NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score INT NOT NULL,
  duration_seconds INT DEFAULT 0,
  answers_json TEXT DEFAULT '{}',
  violation_count INT DEFAULT 0,
  is_disqualified BOOLEAN DEFAULT FALSE,
  disqualification_reason TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Sesi Aktif Telemetry Live Monitoring Ujian CBT
CREATE TABLE IF NOT EXISTS sql_exam_active_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  token_used VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  answers_count INT DEFAULT 0,
  current_question_index INT DEFAULT 0,
  doubt_count INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  violation_count INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  lockout_remaining INT DEFAULT 0,
  force_unlocked BOOLEAN DEFAULT FALSE,
  status VARCHAR(30) DEFAULT 'in_progress',
  user_agent TEXT DEFAULT '',
  ip_address VARCHAR(100) DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
npx vercel deploy --prod --yes
```

---

## 📁 Struktur Direktori Proyek

```text
├── .agents/                # Konfigurasi MCP Agent
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
│   │   └── dashboard.astro # Student Dashboard (Subject Grade Recap & SQL Progress)
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
