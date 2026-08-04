# Dokumentasi Teknis Proyek — Web Suhendar Aryadi

Dokumen ini berisi penjelasan teknis mendalam mengenai arsitektur sistem, alur evaluasi kueri SQL, skema database, serta mekanisme deployment proyek **Web Suhendar Aryadi & Interactive SQL Learning Platform**.

---

## 1. Arsitektur Evaluator Dual-Mode (`sqlEvaluator.ts`)

Platform belajar SQL ini menggunakan dua jenis mode evaluasi otomatis tergantung jenis modul latihan:

### 1.1 Mode `data_match` (Untuk Kueri DML / `SELECT`)
- **Tujuan**: Memastikan query `SELECT` yang ditulis siswa menghasilkan data yang tepat.
- **Cara Kerja**:
  1. Kueri solusi (`solution_sql`) dijalankan di database in-memory SQLite (`sql.js`) untuk menghasilkan `expected_output`.
  2. Kueri siswa (`submitted_code`) dijalankan di database in-memory yang sama.
  3. Evaluator membandingkan:
     - Jumlah baris hasil (*row count*).
     - Kolom dan nama atribut data.
     - Isi data per sel secara terurut / tidak terurut (tergantung kebutuhan soal).
  4. Jika baris data cocok 100%, evaluasi dinyatakan **LULUS** (`passed: true`).

### 1.2 Mode `schema_match` (Untuk Kueri DDL / `CREATE`, `ALTER`, `DROP`, `CONSTRAINTS`)
- **Tujuan**: Memastikan kueri DDL siswa berhasil mengubah/membentuk skema tabel sesuai instruksi soal.
- **Cara Kerja**:
  1. Evaluator menginisialisasi database SQLite kosong.
  2. Evaluator menjalankan kueri DDL siswa (`submitted_code`).
  3. Evaluator membaca struktur fisik database SQLite menggunakan kueri PRAGMA & Meta-Catalog:
     - `SELECT name, sql FROM sqlite_master WHERE type='table';`
     - `PRAGMA table_info(nama_tabel);`
     - `PRAGMA foreign_key_list(nama_tabel);`
     - `PRAGMA index_list(nama_tabel);`
  4. Evaluator membandingkan skema fisik yang terbentuk di SQLite dengan `expected_output_json` secara *case-insensitive* dan mengabaikan urutan spasi/penulisan tipe data (`INT` vs `INTEGER`).
  5. Jika skema tabel, nama kolom, tipe data, dan batasan (*NOT NULL*, *PRIMARY KEY*, *FOREIGN KEY*, *UNIQUE*) cocok, evaluasi dinyatakan **LULUS** (`passed: true`).

---

## 2. Struktur 5 Learning Paths Kurikulum SQL

| Path ID | Nama Learning Path | Jumlah Modul | Rentang Modul | Evaluator Default | Topik Utama |
|---|---|---|---|---|---|
| `basics` | Path 1: SQL Basics | 10 | Modul 1 – 10 | `data_match` | `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, `DELETE`, `LIMIT` |
| `aggregates` | Path 2: Aggregates & Functions | 8 | Modul 11 – 18 | `data_match` | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LIKE`, `IN`, `BETWEEN`, String & Date |
| `joins` | Path 3: Joins & Relasi Tabel | 6 | Modul 19 – 24 | `data_match` | `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `Self Join` |
| `grouping` | Path 4: Grouping & Subqueries | 6 | Modul 25 – 30 | `data_match` | `GROUP BY`, `HAVING`, `Subqueries`, `EXISTS`, `ANY/ALL`, `UNION` |
| `ddl_security` | Path 5: DDL, Constraints & Security | 10 | Modul 31 – 40 | `schema_match` & `data_match` | `CREATE TABLE`, `ALTER`, `DROP`, `Constraints`, `Views`, `SQL Injection` |

---

## 3. Sistem Peringkat Siswa (4-Tier Rank System)

Dihitung secara otomatis di `src/pages/dashboard.astro` berdasarkan jumlah modul unik yang telah diselesaikan di tabel `user_progress`:

| Tier | Peringkat | Syarat Kelulusan | Color Badge Class |
|---|---|---|---|
| Tier 1 | 🟢 **SQL Novice** | 1 – 10 Modul Selesai | `badge-novice` |
| Tier 2 | 🟡 **SQL Intermediate** | 11 – 24 Modul Selesai | `badge-intermediate` |
| Tier 3 | 🔵 **SQL Advanced** | 25 – 39 Modul Selesai | `badge-advanced` |
| Tier 4 | 🏆 **Master SQL Engineer** | 40 Modul Selesai Tuntas | `badge-master` |

---

## 4. Alur Deployment & Build Configuration

- **Platform Target**: Vercel (Serverless Functions)
- **Engine Runtime**: Node.js 22.x
- **Build Command**:
  ```bash
  astro check && astro build && node -e "const fs=require('fs');const p='.vercel/output/functions/_render.func/.vc-config.json';if(fs.existsSync(p)){let c=fs.readFileSync(p,'utf8').replace('nodejs18.x','nodejs20.x');fs.writeFileSync(p,c);}" && pagefind --site dist
  ```
- **Penjelasan Sanitasi Runtime**:  
  Adapter `@astrojs/vercel@7.8.2` versi legacy terkadang menetapkan `"runtime": "nodejs18.x"` secara otomatis jika dijalankan di Node versi lokal yang lebih tinggi. Script pasca-build di atas memastikan file `.vc-config.json` selalu disanitasi ke `"runtime": "nodejs20.x"` sehingga selalu diterima secara valid oleh infrastruktur Vercel.

---

## 5. Pemeliharaan & Pengembangan Lebih Lanjut

1. **Menambah Modul SQL Baru**:
   - Tambahkan definisi modul baru pada array `seedLessons` di file `src/lib/seedLessons.ts`.
   - Jalankan `npx tsx scripts/migrate.js` untuk menyinkronkan modul baru ke database Neon Postgres produksi.
2. **Menambah Artikel Blog / Materi RPL Baru**:
   - Tambahkan file `.md` baru di folder `src/content/posts/` (artikel blog) atau `src/content/modules/` (materi RPL).
