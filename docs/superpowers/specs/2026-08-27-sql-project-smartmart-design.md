# Spesifikasi Desain: Proyek Basis Data SQL "SmartMart POS" (Kelas 11 RPL)

- **Tanggal**: 27 Agustus 2026
- **Mata Pelajaran**: Basis Data / Informatika (Konsentrasi Keahlian RPL)
- **Target Pengguna**: Siswa Kelas 11 RPL & Guru Pengampu (Pak Suhendar Aryadi & Pak Sopiyudin Latif)
- **Format Pengerjaan**: Kelompok (2 Siswa)
- **Alokasi Waktu**: 2 Pekan (2 Pertemuan Praktikum)

---

## 1. Latar Belakang & Tujuan Proyek

Setelah menyelesaikan materi dasar hingga lanjutan pada modul SQL (Path 1 s.d. Path 5) yang mencakup DDL, DML, Agregasi, Multi-Table JOIN, Subqueries, Constraints, dan Views, siswa membutuhkan proyek riil berbasis *Project-Based Learning (PjBL)* untuk mengintegrasikan seluruh konsep dalam satu kesatuan sistem basis data relasional.

Studi kasus **SmartMart POS (Sistem Kasir & Inventaris Mini Market Sekolah)** dipilih karena:
1. Memodelkan proses bisnis ritel modern yang umum di industri perangkat lunak.
2. Memiliki kardinalitas relasi lengkap: 1-to-N (Kategori ke Produk, Kasir ke Transaksi, Pelanggan ke Transaksi) dan N-to-M melalui *junction table* (Transaksi ke Produk melalui Detail Transaksi).
3. Memberikan tantangan analitik bisnis nyata melalui 5 skenario query wajib.

---

## 2. Spesifikasi Arsitektur Basis Data Studi Kasus

### 2.1 Skema 6 Tabel Relasional Wajib

1. **`kategori`**
   - `id_kategori` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `nama_kategori` VARCHAR(100) NOT NULL UNIQUE
   - `deskripsi` TEXT

2. **`produk`**
   - `id_produk` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `kode_barcode` VARCHAR(50) NOT NULL UNIQUE
   - `nama_produk` VARCHAR(150) NOT NULL
   - `id_kategori` INT NOT NULL REFERENCES `kategori(id_kategori)` ON UPDATE CASCADE ON DELETE RESTRICT
   - `harga_beli` DECIMAL(12,2) NOT NULL CHECK (harga_beli >= 0)
   - `harga_jual` DECIMAL(12,2) NOT NULL CHECK (harga_jual >= harga_beli)
   - `stok` INT NOT NULL DEFAULT 0 CHECK (stok >= 0)
   - `satuan` VARCHAR(20) NOT NULL DEFAULT 'Pcs'

3. **`kasir`**
   - `id_kasir` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `nama_kasir` VARCHAR(100) NOT NULL
   - `username` VARCHAR(50) NOT NULL UNIQUE
   - `nomor_hp` VARCHAR(20)
   - `shift` VARCHAR(20) NOT NULL CHECK (shift IN ('Pagi', 'Siang', 'Malam'))

4. **`pelanggan`**
   - `id_pelanggan` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `nama_pelanggan` VARCHAR(100) NOT NULL
   - `nomor_telepon` VARCHAR(20) UNIQUE
   - `poin_member` INT NOT NULL DEFAULT 0 CHECK (poin_member >= 0)
   - `tanggal_bergabung` DATE NOT NULL DEFAULT CURRENT_DATE

5. **`transaksi`**
   - `id_transaksi` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `kode_invoice` VARCHAR(50) NOT NULL UNIQUE
   - `tanggal_transaksi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   - `id_kasir` INT NOT NULL REFERENCES `kasir(id_kasir)` ON UPDATE CASCADE ON DELETE RESTRICT
   - `id_pelanggan` INT REFERENCES `pelanggan(id_pelanggan)` ON UPDATE CASCADE ON DELETE SET NULL
   - `total_belanja` DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total_belanja >= 0)
   - `metode_pembayaran` VARCHAR(30) NOT NULL CHECK (metode_pembayaran IN ('Tunai', 'QRIS', 'Transfer', 'Debit'))

6. **`detail_transaksi`**
   - `id_detail` INT PRIMARY KEY AUTO_INCREMENT / SERIAL
   - `id_transaksi` INT NOT NULL REFERENCES `transaksi(id_transaksi)` ON UPDATE CASCADE ON DELETE CASCADE
   - `id_produk` INT NOT NULL REFERENCES `produk(id_produk)` ON UPDATE CASCADE ON DELETE RESTRICT
   - `jumlah_beli` INT NOT NULL CHECK (jumlah_beli > 0)
   - `harga_satuan` DECIMAL(12,2) NOT NULL CHECK (harga_satuan >= 0)
   - `subtotal` DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0)

---

### 2.2 5 Skenario Query Analitik Bisnis Wajib

1. **Q1: Cetak Nota Transaksi Lengkap (Multi-Table JOIN 5 Tabel)**
   Menggabungkan `transaksi`, `kasir`, `pelanggan`, `detail_transaksi`, dan `produk` untuk menampilkan struk transaksi lengkap dengan penanganan pelanggan anonim (non-member) via `LEFT JOIN`.
2. **Q2: Laporan Rekap Omset & Kuantitas per Kategori Produk**
   Menggunakan `SUM(dt.subtotal)`, `SUM(dt.jumlah_beli)`, `GROUP BY k.nama_kategori`, dan pengurutan `ORDER BY omset DESC`.
3. **Q3: Analisis 3 Produk Terlaris per Shift Kasir**
   Menganalisis pola pembelian konsumen pada shift Pagi vs Siang menggunakan agregasi dan filtering.
4. **Q4: Deteksi Stok Kritis & Produk Tanpa Penjualan (*Dead Stock*)**
   Menggunakan `LEFT JOIN` / `NOT EXISTS` / `Subquery` untuk mendeteksi barang yang perputarannya macet atau stoknya menipis (< 5).
5. **Q5: Objek Database View untuk Dashboard Manajemen**
   Membuat objek `CREATE VIEW view_rekap_penjualan_harian` yang menyajikan ringkasan transaksi per hari, jumlah transaksi unik, total omset, dan rata-rata belanja per transaksi.

---

## 3. Desain Arsitektur Data Web & Skema Penyimpanan

Tabel baru pada PostgreSQL (Neon DB):

```sql
CREATE TABLE IF NOT EXISTS sql_project_submissions (
  id SERIAL PRIMARY KEY,
  leader_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  member_name_manual VARCHAR(255),
  team_name VARCHAR(150) NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  project_title VARCHAR(200) DEFAULT 'SmartMart POS - Sistem Basis Data Kasir Ritel',
  sql_script_link TEXT NOT NULL,
  report_pdf_link TEXT,
  query_1_text TEXT NOT NULL,
  query_2_text TEXT NOT NULL,
  query_3_text TEXT NOT NULL,
  query_4_text TEXT NOT NULL,
  query_5_text TEXT NOT NULL,
  notes TEXT,
  score INTEGER DEFAULT NULL,
  teacher_feedback TEXT DEFAULT NULL,
  graded_by_email VARCHAR(255) DEFAULT NULL,
  graded_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sql_proj_leader ON sql_project_submissions(leader_user_id);
CREATE INDEX IF NOT EXISTS idx_sql_proj_class ON sql_project_submissions(class_name);
```

---

## 4. Rencana Implementasi Komponen Web

1. **Halaman Panduan & Form Pengumpulan Siswa (`src/pages/belajar/sql/proyek.astro`)**:
   - Header interaktif: Judul proyek, nama tim, status pengerjaan, deadline.
   - Accordion Panduan & Rubrik Penilaian Proyek (25% DDL/Constraints, 20% DML Seeding, 35% 5 Query Analitik, 20% Dokumentasi/Presentasi).
   - Form Submission: Input Nama Rekan, Link `.sql` & Laporan PDF, 5 Textarea Query Analitik dengan sintaks format rapi.
   - Status Card: Informasi nilai & catatan perbaikan dari guru jika sudah dinilai.

2. **API Endpoint Submission (`src/pages/api/sql/submit-project.ts`)**:
   - Menerima payload JSON dari siswa.
   - Validasi sesi login (`getSessionUser`).
   - Melakukan INSERT atau UPDATE (upsert) ke tabel `sql_project_submissions`.

3. **Portal Penilaian Guru (`src/pages/admin/lkpd.astro` & API Grading)**:
   - Menambahkan tab khusus `PROYEK: SmartMart POS`.
   - Menampilkan daftar kiriman per kelas dengan badge status (*Belum Dinilai / Tuntas / Remedial*).
   - Drawer inspeksi lengkap: detail tim, link download berkas `.sql` dan PDF, tampilan 5 query SQL.
   - Form grading: Input nilai 0–100 + catatan evaluasi guru yang memicu `POST /api/admin/grade-sql-project`.
   - Fitur Ekspor CSV Rekap Nilai Proyek SQL.

4. **Navigasi & Tautan Masuk**:
   - Menambahkan link/banner tugas proyek pada katalog modul SQL (`src/pages/belajar/sql/index.astro`).

---

## 5. Rubrik Penilaian Proyek (Skala 0–100)

| Kriteria | Bobot | Deskripsi Indikator Keberhasilan |
| :--- | :---: | :--- |
| **Perancangan Skema, ERD & DDL Constraints** | 25% | Tabel memuat 6 entitas wajib, tipe data akurat, Primary Key & Foreign Key konsisten, batasan `NOT NULL`, `CHECK`, `UNIQUE`, serta `ON DELETE/UPDATE` bekerja tepat. |
| **Kualitas Data Sampel (DML Seeding)** | 20% | Tiap tabel terisi minimal 10–15 baris data realistis; data transaksi memiliki relasi yang valid dan merepresentasikan aktivitas toko riil. |
| **5 Query Analitik Bisnis** | 35% | Kelima kueri (Multi-table JOIN, Agregasi GROUP BY/HAVING, Analisis shift, Subquery stok kritis, dan Database View) menghasilkan output yang benar dan efisien. |
| **Kerapian Kode, Berkas `.sql` & Dokumentasi** | 20% | Script SQL terstruktur rapi, dapat dieksekusi tanpa error dari awal hingga akhir, dan dokumen laporan menjelaskan relasi tabel dengan jelas. |
