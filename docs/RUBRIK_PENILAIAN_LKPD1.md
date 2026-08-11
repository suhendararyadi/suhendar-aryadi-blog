# 📘 DOKUMENTASI STANDAR & RUBRIK PENILAIAN OBJEKTIF LKPD 1 (BERPIKIR KOMPUTASIONAL)
**Portal Pembelajaran Vokasi RPL SMK & Platform SQL Interaktif**
*Pengampu / Guru Utama: Suhendar Aryadi, S.Pd.,Gr.*

---

## 📌 1. LATAR BELAKANG & TUJUAN STANDARISASI
Dokumen ini disusun sebagai panduan resmi dan pedoman baku dalam mengevaluasi hasil pengerjaan **Lembar Kerja Peserta Didik (LKPD) Digital 1: Berpikir Komputasional (BK)** bagi siswa SMK Rekayasa Perangkat Lunak (RPL) dan Informatika.

Tujuan utama dokumen ini adalah:
1. Menjamin **konsistensi 100%** dalam pemberian nilai dan umpan balik (*teacher feedback*), baik yang dilakukan oleh Guru maupun Asisten AI Agent.
2. Menyediakan indikator pencapaian objektif berbasis **4 Pilar Berpikir Komputasional** (Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma/Struktur Data).
3. Memberikan umpan balik konstruktif yang memotivasi siswa untuk mengembangkan pemodelan perangkat lunak berstandar industri.

---

## 🎯 2. RINGKASAN BOBOT & SKOR MAKSIMAL

- **Skor Maksimal**: **`100 Poin`**
- **Sistem Pembobotan**: 4 Pilar Utama (Masing-masing pilar memiliki bobot maksimal **`25 Poin`**).

$$\text{Skor Akhir} = \text{Skor Dekomposisi} + \text{Skor Pengenalan Pola} + \text{Skor Abstraksi} + \text{Skor Algoritma}$$

---

## 📐 3. PARAMETER & RUBRIK PENILAIAN DETAIL (4 PILAR)

### 🧩 PILAR 1: DEKOMPOSISI (DECOMPOSITION) — [BOBOT MAKSIMAL: 25 POIN]
> **Definisi**: Kemampuan memecah sistem perangkat lunak yang kompleks (Kiosk Restoran / E-Kantin Sekolah / SmartKlinik / Proyek Mandiri) menjadi modul-modul kecil yang logis, independen, dan terstruktur.

| Rentang Skor | Kriteria Penilaian Objektif |
| :---: | --- |
| **21 – 25 Poin** *(Sangat Baik)* | Memecah sistem menjadi **4 modul lengkap** dengan nama modul spesifik dan rincian fungsi teknis yang sangat spesifik, logis, serta relevan dengan studi kasus yang dipilih. |
| **16 – 20 Poin** *(Baik / Cukup)* | Memecah menjadi **3–4 modul**, namun beberapa deskripsi fungsi masih terlalu umum, bernada ambigu, atau ada sedikit tumpang tindih alur kerja antar modul. |
| **10 – 15 Poin** *(Kurang)* | Hanya memecah menjadi **1–2 modul**, atau penjelasan fungsi tidak relevan dengan kebutuhan sistem perangkat lunak. |
| **0 Poin** *(Tidak Ada)* | Kolom dekomposisi kosong atau diisi acak tanpa makna (*junk input*). |

---

### 🔍 PILAR 2: PENGENALAN POLA (PATTERN RECOGNITION) — [BOBOT MAKSIMAL: 25 POIN]
> **Definisi**: Kemampuan mengidentifikasi kesamaan pola alur kerja berulang, keseragaman arsitektur tabel data, atau algoritma pencarian/pengurutan yang dapat dipakai kembali (*reusable logic*).

| Rentang Skor | Kriteria Penilaian Objektif |
| :---: | --- |
| **21 – 25 Poin** *(Sangat Baik)* | Berhasil mengidentifikasi **minimal 2 pola berulang** yang kuat (misal: keseragaman struktur data produk, pola autentikasi multi-role, alur checkout, atau validasi stok) beserta solusi terpusatnya. |
| **16 – 20 Poin** *(Baik / Cukup)* | Mengidentifikasi **1–2 pola**, namun rancangan solusi pengulangannya masih bersifat umum atau belum konkret secara implementasi teknis. |
| **10 – 15 Poin** *(Kurang)* | Pola yang diidentifikasi tidak menggambarkan logika pengulangan dalam sistem perangkat lunak. |
| **0 Poin** *(Tidak Ada)* | Kolom pengenalan pola kosong atau diisi acak. |

---

### 🎨 PILAR 3: ABSTRAKSI (ABSTRACTION) — [BOBOT MAKSIMAL: 25 POIN]
> **Definisi**: Kemampuan memisahkan atribut data yang **penting & esensial (Kept)** untuk pemodelan database/sistem transaksi dari data yang **tidak penting / harus diabaikan (Ignored)**.

| Rentang Skor | Kriteria Penilaian Objektif |
| :---: | --- |
| **21 – 25 Poin** *(Sangat Baik)* | Pemisahan data sangat tajam. **Data Penting (Kept)** mencakup atribut kunci database (misal: ID, Nama, Stok, Harga, Status, Waktu) dan **Data Diabaikan (Ignored)** menyasar variabel fisik/pribadi non-relevan (misal: warna kemasan, mood pembeli, cuaca, alamat rumah). |
| **16 – 20 Poin** *(Baik / Cukup)* | Pemisahan data sudah benar secara umum, tetapi masih ada 1–2 atribut esensial yang terlewat atau data diabaikan masih kurang spesifik. |
| **10 – 15 Poin** *(Kurang)* | Siswa tidak dapat membedakan data esensial sistem dari data non-relevan (misal memasukkan atribut fisik ke dalam data penting). |
| **0 Poin** *(Tidak Ada)* | Kolom abstraksi kosong atau diisi acak. |

---

### ⚙️ PILAR 4: ALGORITMA & STRUKTUR DATA — [BOBOT MAKSIMAL: 25 POIN]
> **Definisi**: Kemampuan menerapkan algoritma pencarian & pengurutan, menerapkan struktur data **Queue (FIFO)** dan **Stack (LIFO)** secara nyata, serta menuliskan **Pseudocode** alur sistem yang terstruktur.

| Indikator Sub-Pilar | Kriteria Penilaian & Penerapan |
| --- | --- |
| **Queue (FIFO)** | **First In First Out**. Harus diterapkan pada alur antrean fisik/dapur/pasien (misal: pesanan yang masuk lebih dulu diproses/diambil lebih dulu). |
| **Stack (LIFO)** | **Last In First Out**. Harus diterapkan pada alur pembatalan/undo transaksi, riwayat penyesuaian stok terakhir, atau navigasi undo. |
| **Pseudocode** | Harus mengandung struktur alur yang logis dengan pengecekan kondisional `IF - THEN - ELSE` (misal: validasi ketersediaan stok atau saldo). |

| Rentang Skor | Kriteria Penilaian Objektif |
| :---: | --- |
| **21 – 25 Poin** *(Sangat Baik)* | Penjelasan penerapan Queue (FIFO) dan Stack (LIFO) tepat sasaran, serta pseudocode memiliki alur logika kondisional yang lengkap dan runtut. |
| **16 – 20 Poin** *(Baik / Cukup)* | Konsep Queue & Stack dijelaskan dengan benar, namun pseudocode masih terlalu singkat atau kurang detail pada alur bercabang (`IF-ELSE`). |
| **10 – 15 Poin** *(Kurang)* | Terdapat kekeliruan mendasar (misal terbalik mendefinisikan prinsip FIFO dan LIFO) atau pseudocode tidak logis. |
| **0 Poin** *(Tidak Ada)* | Kolom algoritma kosong atau diisi acak. |

---

## 💬 4. FORMAT STANDARD UMPAN BALIK GURU (TEACHER FEEDBACK)

Setiap hasil penilaian wajib menyertakan umpan balik tertulis yang memenuhi struktur 3 elemen:
1. **Apresiasi Positif**: Menyebut nama siswa dan memuji kelebihan karya mereka.
2. **Poin Keunggulan Utama**: Meng highlight penerapan pilar BK yang paling menonjol (misal: penulisan Queue/Stack atau pemodelan tabel abstraksi).
3. **Saran Rekomendasi (Jika Ada)**: Catatan konstruktif untuk peningkatan pseudocode atau kelengkapan variabel di modul berikutnya.

### Contoh Template Umpan Balik Resmi:
> `"Luar biasa, [Nama Siswa]! Analisis 4 Pilar Berpikir Komputasional untuk [Nama Studi Kasus] sangat matang dan terstruktur. Penggunaan Queue pada [antrean dapur/pasien (FIFO)] dan Stack pada [fitur batal/undo (LIFO)] tepat menggambarkan prinsip dasar struktur data RPL. Pseudocode yang kamu buat juga sangat logis dan rapi. Pertahankan prestasi ini!"`

---

## 🛠️ 5. RIWAYAT VERIFIKASI & AUDIT SYSTEM
- **Tanggal Penyusunan Standar**: 11 Agustus 2026
- **Status Audit Database**: 100% dari total 49 pengajuan LKPD 1 BK telah tuntas dinilai dengan mematuhi standar parameter ini.
- **Lokasi Berkas**: `docs/RUBRIK_PENILAIAN_LKPD1.md`
