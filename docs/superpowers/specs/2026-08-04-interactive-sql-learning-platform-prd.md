# PRD Spec: Interactive SQL Learning Platform (FreeCodeCamp Style)

- **Owner**: Suhendar Aryadi, S.Kom. (Guru RPL SMK)
- **Status**: Disetujui
- **Tanggal**: 2026-08-04
- **Teknologi**: Astro v4 (SSR Mode via `@astrojs/vercel`), Vercel Postgres, CodeMirror 6, bcryptjs, JWT / Session Cookies

---

## 1. Visi & Tujuan Sistem

Platform Pembelajaran Coding Interaktif bergaya **FreeCodeCamp** yang terintegrasi di dalam web blog Suhendar Aryadi. Platform ini memungkinkan siswa RPL SMK untuk:
1. **Belajar Teori & Praktik SQL**: Membaca materi terstruktur (berbasis standar W3Schools) dan langsung mempraktikkan query SQL di editor interaktif.
2. **Autentikasi & Akun Siswa**: Mendaftar/Login untuk menyimpan progres penyelesaian soal, skor, dan sertifikat modul.
3. **Eksekusi & Evaluasi Otomatis**: Hasil query siswa dievaluasi secara serverless di backend Vercel Postgres / SQLite Sandbox dengan umpan balik instant (*PASS / FAIL*).
4. **Dashboard Pemantauan Guru**: Memudahkan Guru RPL melihat rekapitulasi progres dan nilai seluruh siswa.

---

## 2. Skema Database (Vercel Postgres / SQL Schema)

```sql
-- 1. Tabel User (Siswa & Guru)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student', -- 'student' | 'teacher'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Session Login
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL
);

-- 3. Tabel Modul & Soal Latihan SQL
CREATE TABLE sql_lessons (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'Basic Query', 'Data Manipulation', 'Aggregation', 'Joins'
  order_index INT NOT NULL,
  theory_markdown TEXT NOT NULL,
  instructions_markdown TEXT NOT NULL,
  seed_sql TEXT NOT NULL, -- SQL script untuk membuat tabel & data sampel latihan
  expected_sql TEXT NOT NULL, -- Query SQL kunci jawaban
  initial_code TEXT DEFAULT 'SELECT * FROM students;'
);

-- 4. Tabel Progres Siswa (Completed Lessons)
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES sql_lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'completed', -- 'completed'
  submitted_code TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

---

## 3. Komponen Antarmuka & Layar (UI/UX Design)

### 3.1 Halaman Register & Login (`/auth/login`, `/auth/register`)
- Form pendaftaran akun siswa (Nama Lengkap, Email/NISN, Password).
- Form login dengan enkripsi password `bcryptjs` dan pembuatan cookie `session_id`.

### 3.2 Halaman Katalog Pembelajaran SQL (`/belajar/sql`)
- Daftar modul pembelajaran SQL terstruktur (*Progress Bar*, Indikator Centang Hijau untuk materi yang sudah Lulus).
- Tombol "Mulai Latihan" atau "Lanjutkan Latihan".

### 3.3 Halaman Workspace Interaktif (`/belajar/sql/[slug]`)
- **Split Screen Layout**:
  - **Panel Kiri (Instruksi & Teori)**: Teori W3Schools, petunjuk soal, kriteria kelulusan (*checklist*), dan tombol "Petunjuk / Hint".
  - **Panel Kanan Atas (Code Editor)**: Integrasi CodeMirror 6 dengan *SQL Syntax Highlighting*, nomor baris, tombol `[ Run Query ]` dan `[ Submit Solution ]`.
  - **Panel Kanan Bawah (Hasil & Console Log)**: 
    - Tab 1: **Tabel Output Query** (menampilkan hasil `SELECT` siswa).
    - Tab 2: **Validation Output** (Pesan `✅ All Tests Passed! Next Lesson Unlocked` atau `❌ Test Failed: Expected N rows, got M rows`).

### 3.4 Dashboard Profil Siswa (`/dashboard`)
- Statistik penyelesaian materi (% Progress SQL).
- Riwayat soal yang telah diselesaikan.

---

## 4. Alur Kerja Evaluasi Query SQL (Backend Evaluation Pipeline)

1. Siswa mengetik query di CodeMirror editor dan menekan `[ Submit Solution ]`.
2. Request POST dikirim ke API Endpoint `/api/sql/evaluate`.
3. Backend Serverless Astro:
   a. Memverifikasi session login siswa.
   b. Menjalankan `seed_sql` (menyiapkan tabel sandbox).
   c. Menjalankan `expected_sql` (mendapatkan hasil jawaban benar).
   d. Menjalankan query siswa `submitted_code`.
   e. Membandingkan struktur kolom dan baris hasil query.
4. Jika hasil cocok:
   - Simpan / Update `user_progress` ke Vercel Postgres.
   - Return respon JSON `{ success: true, message: "Selamat! Jawaban Anda Benar." }`.
5. Jika salah:
   - Return respon JSON `{ success: false, error: "Jumlah baris tidak sesuai dengan instruksi." }`.

---

## 5. Struktur Folder Proyek Astro Full-Stack

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SqlEditor.client.astro   # CodeMirror 6 Editor
│   │   ├── SqlResultTable.astro     # Render Tabel Data SQL
│   │   └── ProgressTracker.astro
│   ├── lib/
│   │   ├── db.ts                    # Vercel Postgres client
│   │   ├── auth.ts                  # Session & bcrypt authentication helper
│   │   └── sqlEvaluator.ts          # Logic penguji jawaban SQL
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   ├── register.ts
│   │   │   │   └── logout.ts
│   │   │   └── sql/
│   │   │       ├── execute.ts
│   │   │       └── evaluate.ts
│   │   ├── auth/
│   │   │   ├── login.astro
│   │   │   └── register.astro
│   │   ├── belajar/
│   │   │   └── sql/
│   │   │       ├── index.astro       # Katalog Materi SQL
│   │   │       └── [...slug].astro   # Split Screen Workspace
│   │   ├── dashboard.astro
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json
```

---

## 6. Kriteria Keberhasilan & Pengujian

1. **Autentikasi**: Siswa dapat mendaftar, login, dan logout dengan aman (session terproteksi cookie HTTP-only).
2. **Interaktivitas Editor**: CodeMirror editor responsif dengan *syntax highlighting* SQL.
3. **Akurasi Evaluasi**: Query SQL siswa dievaluasi dengan tepat. Jawaban benar menyimpan statistik ke Vercel Postgres.
4. **Keamanan**: Sandbox eksekusi terisolasi dan mencegah SQL Injection berbahaya pada database utama platform.
