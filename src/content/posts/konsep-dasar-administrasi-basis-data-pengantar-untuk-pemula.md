---
title: "Konsep Dasar & Administrasi Basis Data: Pengantar untuk Pemula"
description: "Materi Basis Data — Fase F, Kelas XI RPL. Memahami pengertian basis data, hierarki, DBMS, primary/foreign key, hingga administrasi dasar."
pubDate: 2026-07-23
author: "Suhendar Aryadi, S.Pd.,Gr."
tags: ["Basis Data", "SQL", "DBMS", "RPL", "SMK"]
category: "Database & Backend"
featured: true
image: "https://cdn.hashnode.com/uploads/covers/6591788256571c18b0eaa950/d98053d8-4471-437d-b27e-837d459bc9fc.jpg"
---

Coba bayangkan perpustakaan sekolah kalian. Koleksinya bisa ribuan judul buku, ratusan siswa aktif meminjam tiap hari, dan setiap buku punya status yang berbeda-beda: ada yang tersedia, ada yang sedang dipinjam, ada yang sedang diperbaiki. Bagaimana caranya petugas perpustakaan tetap tahu buku mana yang dipinjam siapa, dan kapan harus dikembalikan — tanpa harus menghafal semuanya di kepala?

Jawabannya: semua data itu disimpan dan dikelola dalam sebuah **basis data (database)**. Bukan cuma perpustakaan — sistem akademik sekolah, aplikasi e-commerce, layanan perbankan digital, sampai media sosial yang kalian pakai setiap hari, semuanya berjalan di atas basis data. Artikel ini akan mengenalkan kalian pada konsep dasarnya: pengertian, hierarki, struktur, aturan, sampai cara menginstal dan mengelola basis data secara sederhana.

---

## 1. Apa itu Basis Data?

**Basis data (database)** adalah kumpulan data yang saling berhubungan, disimpan secara terorganisir, dan dikelola sehingga mudah diakses, dikelola, dan diperbarui.

Kenapa ini penting? Coba bayangkan kalau data perpustakaan tadi hanya dicatat di banyak buku catatan terpisah oleh petugas yang berbeda-beda. Pasti akan muncul masalah:

- **Duplikasi data** — data buku yang sama bisa tercatat dua kali dengan informasi berbeda.
- **Data tidak konsisten** — status buku "dipinjam" di satu catatan, tapi "tersedia" di catatan lain.
- **Sulit dicari** — mencari satu buku di antara ribuan catatan manual bisa memakan waktu lama.

Basis data hadir untuk menyelesaikan ketiga masalah ini sekaligus:

- Menghindari duplikasi data yang tidak perlu.
- Menjaga konsistensi dan integritas data.
- Memudahkan pencarian dan pengolahan data dalam jumlah besar.

Contoh basis data yang kalian pakai sehari-hari: sistem akademik sekolah, aplikasi e-commerce, perbankan digital, dan media sosial.

---

## 2. Hierarki Basis Data

Data dalam basis data tersusun dalam beberapa lapisan, dari yang paling besar sampai paling kecil:

1. **Database** — kumpulan dari beberapa tabel yang saling berkaitan. Ini adalah "wadah besar" tempat semua data tersimpan.
2. **Table (Tabel)** — kumpulan data sejenis, tersusun dalam baris dan kolom. Misalnya tabel `buku` atau tabel `anggota`.
3. **Record (Baris)** — satu set data lengkap dalam satu baris tabel. Misalnya satu baris berisi data lengkap satu buku.
4. **Field (Kolom)** — satu kategori atau atribut data, misalnya kolom `judul`, `pengarang`, atau `status`.
5. **Byte / Karakter** — satuan data terkecil yang menyusun sebuah field, seperti huruf-huruf yang membentuk judul buku.

Bayangkan seperti lemari arsip: database adalah lemarinya, tabel adalah masing-masing laci, record adalah satu folder di dalam laci, dan field adalah satu kolom informasi di formulir dalam folder tersebut.

---

## 3. Struktur & Komponen Basis Data

Ada beberapa istilah kunci yang wajib kalian kenal saat bekerja dengan basis data:

- **DBMS (Database Management System)** — perangkat lunak yang mengelola basis data, contohnya MySQL, MariaDB, atau PostgreSQL.
- **Table** — kumpulan data sejenis dalam baris dan kolom.
- **Field / Record** — kolom (kategori data) dan baris (satu set data lengkap).
- **Primary Key** — kolom unik yang mengidentifikasi setiap record. Tidak boleh ada dua record dengan primary key yang sama.
- **Foreign Key** — kolom penghubung antar tabel yang saling berelasi, misalnya kolom `id_anggota` di tabel `peminjaman` yang merujuk ke tabel `anggota`.
- **Constraint** — aturan validasi data, misalnya `NOT NULL` (tidak boleh kosong) atau `UNIQUE` (tidak boleh ada duplikat).

Primary key dan foreign key ini yang membuat tabel-tabel dalam satu database bisa "berbicara" satu sama lain — misalnya tabel `peminjaman` bisa tahu buku mana yang dipinjam oleh anggota mana, tanpa harus menulis ulang seluruh data anggota di setiap baris peminjaman.

---

## 4. Aturan Dasar dalam Basis Data

Supaya data tetap rapi dan bisa diandalkan, ada beberapa aturan dasar yang perlu dipegang:

- **Primary key harus unik.** Setiap record wajib punya pengenal unik dan tidak boleh kosong (`NOT NULL`).
- **Tipe data harus konsisten.** Setiap kolom memiliki tipe data yang jelas dan konsisten, misalnya `INT` untuk angka, `VARCHAR` untuk teks, atau `DATE` untuk tanggal.
- **Integritas referensial harus dijaga.** Relasi antar tabel dijaga lewat foreign key, sehingga data yang saling terhubung tetap valid dan tersambung dengan benar.

---

## 5. Instalasi Basis Data (MySQL/MariaDB)

Sebelum bisa praktik, kalian perlu menyiapkan DBMS di komputer masing-masing. Berikut langkah dasarnya dengan MySQL/MariaDB:

1. Unduh dan instal paket server MySQL/MariaDB, atau gunakan XAMPP yang sudah menyertakan keduanya sekaligus.
2. Jalankan service MySQL/MariaDB lewat XAMPP Control Panel atau terminal.
3. Akses lewat antarmuka phpMyAdmin (berbasis web), atau tool seperti MySQL Workbench.
4. Uji koneksi dengan login dan menjalankan query sederhana.

Contoh menguji koneksi lewat terminal:

```bash
$ mysql -u root -p
Enter password: ****
mysql> SHOW DATABASES;
```

---

## 6. Dasar Administrasi Basis Data

Setelah DBMS terpasang, langkah selanjutnya adalah administrasi dasar:

- **Membuat & menghapus database** — `CREATE DATABASE`, `DROP DATABASE`.
- **Mengelola user & hak akses** — `CREATE USER`, `GRANT`, `REVOKE`.
- **Memantau status server & daftar database** — `SHOW DATABASES`, `STATUS`.

```sql
CREATE DATABASE perpustakaan;
CREATE USER 'admin_pustaka'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON perpustakaan.* TO 'admin_pustaka'@'localhost';
FLUSH PRIVILEGES;
```

---

## Penutup

Singkatnya: basis data menyimpan dan mengelola data agar konsisten, tidak duplikat, dan mudah diakses. Di artikel berikutnya, kita akan lanjut ke bagian yang lebih teknis: **Data Definition Language (DDL)** dan **Data Manipulation Language (DML)**.
