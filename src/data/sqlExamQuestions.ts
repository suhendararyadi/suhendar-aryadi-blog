export interface SqlExamOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface SqlExamQuestion {
  id: number;
  category: 
    | 'Konsep Relasional & Kunci' 
    | 'Data Definition Language (DDL)' 
    | 'Data Manipulation Language (DML)' 
    | 'Operator & Fungsi Agregasi' 
    | 'JOIN & Relasi Multi-Tabel' 
    | 'Pengelompokan & Subquery' 
    | 'Normalisasi & Anomali Data' 
    | 'Transaksi ACID & Arsitektur DB';
  question: string;
  codeSnippet?: string;
  options: SqlExamOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
}

export const sqlExamQuestions: SqlExamQuestion[] = [
  // =========================================================================
  // KATEGORI 1: KONSEP RELASIONAL & KUNCI (No 1 - 4)
  // =========================================================================
  {
    id: 1,
    category: 'Konsep Relasional & Kunci',
    question: 'Dalam sebuah sistem perpustakaan sekolah, satu siswa dapat meminjam banyak buku, dan satu judul buku dapat dipinjam oleh banyak siswa dalam kurun waktu berbeda. Jenis relasi kardinalitas antarentitas tersebut dan solusi implementasinya pada basis data fisik yang paling tepat adalah...',
    options: [
      { key: 'A', text: 'One-to-One (1:1), diimplementasikan dengan menaruh Foreign Key pada salah satu tabel utama.' },
      { key: 'B', text: 'One-to-Many (1:N), diimplementasikan dengan menambahkan kolom id_siswa langsung ke dalam tabel buku.' },
      { key: 'C', text: 'Many-to-Many (M:N), diimplementasikan dengan membuat tabel perantara (junction/pivot table) yang menampung Foreign Key dari kedua tabel.' },
      { key: 'D', text: 'Many-to-One (N:1), diimplementasikan dengan menggabungkan tabel siswa dan tabel buku menjadi satu tabel denormalisasi.' },
      { key: 'E', text: 'Recursive Relationship, diimplementasikan dengan Foreign Key yang merujuk ke tabel itu sendiri.' }
    ],
    correctAnswer: 'C',
    explanation: 'Hubungan banyak-ke-banyak (Many-to-Many / M:N) dalam basis data relasional tidak dapat dihubungkan langsung secara efisien tanpa tabel ketiga (junction/associative table), misalnya tabel `peminjaman` yang menyimpan `id_siswa` dan `id_buku`.'
  },
  {
    id: 2,
    category: 'Konsep Relasional & Kunci',
    question: 'Pada tabel nilai_siswa, setiap baris data diidentifikasi secara unik oleh gabungan dua kolom sekaligus, yaitu `nis` dan `kode_mapel`. Istilah untuk kunci utama yang terbentuk dari kombinasi dua atau lebih atribut kolom adalah...',
    codeSnippet: 'CREATE TABLE nilai_siswa (\n  nis VARCHAR(10) NOT NULL,\n  kode_mapel VARCHAR(10) NOT NULL,\n  nilai_akhir NUMERIC(5,2),\n  PRIMARY KEY (nis, kode_mapel)\n);',
    options: [
      { key: 'A', text: 'Surrogate Key' },
      { key: 'B', text: 'Composite Primary Key' },
      { key: 'C', text: 'Foreign Key' },
      { key: 'D', text: 'Alternate Key' },
      { key: 'E', text: 'Super Key Tunggal' }
    ],
    correctAnswer: 'B',
    explanation: 'Composite Primary Key (kunci komposit) adalah Primary Key yang terdiri dari dua atau lebih kolom/atribut untuk menjamin keunikan identitas setiap baris pada tabel.'
  },
  {
    id: 3,
    category: 'Konsep Relasional & Kunci',
    question: 'Manakah pernyataan yang paling tepat mengenai karakteristik dari Foreign Key (Kunci Tamu) dalam menjaga Integritas Referensial (*Referential Integrity*)?',
    options: [
      { key: 'A', text: 'Foreign Key harus selalu memiliki nilai unik dan tidak boleh bernilai NULL pada setiap barisnya.' },
      { key: 'B', text: 'Foreign Key pada tabel anak (child) harus merujuk ke kolom Primary Key atau Unique Key yang valid pada tabel induk (parent).' },
      { key: 'C', text: 'Sebuah tabel hanya diperbolehkan memiliki maksimal satu kolom Foreign Key.' },
      { key: 'D', text: 'Nilai pada Foreign Key boleh ada meskipun data induk pada tabel rujukan belum pernah di-insert sama sekali.' },
      { key: 'E', text: 'Foreign Key otomatis menghapus tabel induk jika tabel anak mengalami perubahan data.' }
    ],
    correctAnswer: 'B',
    explanation: 'Foreign Key menjamin integritas referensial dengan memastikan bahwa nilai kolom pada child table harus merujuk pada baris yang valid di tabel parent (biasanya Primary Key atau Unique constraint).'
  },
  {
    id: 4,
    category: 'Konsep Relasional & Kunci',
    question: 'Kandidat kunci (*Candidate Key*) adalah atribut atau himpunan atribut yang berpotensi menjadi Primary Key. Jika sebuah tabel pengguna memiliki kolom `id`, `email`, dan `nomor_ktp` yang semuanya unik dan tidak boleh bernilai NULL, maka kolom yang tidak terpilih menjadi Primary Key disebut sebagai...',
    options: [
      { key: 'A', text: 'Alternate Key' },
      { key: 'B', text: 'Foreign Key' },
      { key: 'C', text: 'Natural Key' },
      { key: 'D', text: 'Null Key' },
      { key: 'E', text: 'Artificial Key' }
    ],
    correctAnswer: 'A',
    explanation: 'Alternate Key (kunci pengganti) adalah Candidate Key yang tidak dipilih sebagai Primary Key utama, namun tetap memiliki batasan unik (UNIQUE) untuk menjaga integritas entitas.'
  },

  // =========================================================================
  // KATEGORI 2: DATA DEFINITION LANGUAGE / DDL & CONSTRAINTS (No 5 - 9)
  // =========================================================================
  {
    id: 5,
    category: 'Data Definition Language (DDL)',
    question: 'Perhatikan definisi relasi tabel berikut. Apa perilaku yang terjadi pada data di tabel `pesanan` apabila sebuah baris pelanggan di tabel `pelanggan` dihapus?',
    codeSnippet: 'CREATE TABLE pesanan (\n  id_pesanan SERIAL PRIMARY KEY,\n  id_pelanggan INT,\n  total_bayar INT NOT NULL,\n  FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id) ON DELETE SET NULL\n);',
    options: [
      { key: 'A', text: 'Operasi penghapusan pelanggan akan ditolak dan menghasilkan error constraint violation.' },
      { key: 'B', text: 'Seluruh riwayat pesanan milik pelanggan tersebut akan otomatis ikut terhapus secara permanen.' },
      { key: 'C', text: 'Nilai pada kolom id_pelanggan di tabel pesanan yang terkait akan otomatis diubah menjadi NULL.' },
      { key: 'D', text: 'Nilai pada kolom id_pelanggan akan diisi nilai default 0.' },
      { key: 'E', text: 'Tabel pesanan akan dinonaktifkan sementara oleh database engine.' }
    ],
    correctAnswer: 'C',
    explanation: 'Klausa `ON DELETE SET NULL` memastikan bahwa ketika baris di tabel induk (parent) dihapus, nilai foreign key pada tabel anak (child) yang berelasi diubah menjadi `NULL`, tanpa menghapus data pesanan.'
  },
  {
    id: 6,
    category: 'Data Definition Language (DDL)',
    question: 'Perintah DDL yang paling tepat dan baku untuk menambahkan batasan (*constraint*) bahwa nilai pada kolom `gaji_pokok` dalam tabel `karyawan` tidak boleh bernilai negatif (harus >= 0) adalah...',
    options: [
      { key: 'A', text: 'ALTER TABLE karyawan ADD CONSTRAINT chk_gaji CHECK (gaji_pokok >= 0);' },
      { key: 'B', text: 'UPDATE TABLE karyawan SET CONSTRAINT gaji_pokok >= 0;' },
      { key: 'C', text: 'CREATE CONSTRAINT chk_gaji ON karyawan (gaji_pokok >= 0);' },
      { key: 'D', text: 'ALTER TABLE karyawan MODIFY gaji_pokok NOT NEGATIVE;' },
      { key: 'E', text: 'INSERT INTO karyawan CONSTRAINT (gaji_pokok >= 0);' }
    ],
    correctAnswer: 'A',
    explanation: 'Sintaks standar SQL untuk menambahkan batasan validasi nilai kolom pada tabel yang sudah ada adalah `ALTER TABLE <nama_tabel> ADD CONSTRAINT <nama_constraint> CHECK (<kondisi>);`.'
  },
  {
    id: 7,
    category: 'Data Definition Language (DDL)',
    question: 'Administrator basis data ingin mengubah tipe data kolom `nomor_telepon` pada tabel `pemasok` dari `INT` menjadi `VARCHAR(20)`. Perintah SQL PostgreSQL yang benar adalah...',
    options: [
      { key: 'A', text: 'ALTER TABLE pemasok CHANGE nomor_telepon VARCHAR(20);' },
      { key: 'B', text: 'ALTER TABLE pemasok ALTER COLUMN nomor_telepon TYPE VARCHAR(20);' },
      { key: 'C', text: 'MODIFY TABLE pemasok COLUMN nomor_telepon VARCHAR(20);' },
      { key: 'D', text: 'UPDATE pemasok SET DATA TYPE nomor_telepon = VARCHAR(20);' },
      { key: 'E', text: 'REPLACE COLUMN nomor_telepon ON pemasok WITH VARCHAR(20);' }
    ],
    correctAnswer: 'B',
    explanation: 'Dalam standar SQL / PostgreSQL, perubahan tipe data kolom dilakukan menggunakan sintaks `ALTER TABLE <tabel> ALTER COLUMN <kolom> TYPE <tipe_baru>;`.'
  },
  {
    id: 8,
    category: 'Data Definition Language (DDL)',
    question: 'Perhatikan perintah SQL berikut ini. Mengapa administrator basis data lebih memilih TRUNCATE daripada DELETE ketika ingin mengosongkan tabel log berukuran jutaan baris?',
    codeSnippet: 'TRUNCATE TABLE log_aktivitas_sistem RESTART IDENTITY;',
    options: [
      { key: 'A', text: 'Karena TRUNCATE memeriksa klausa WHERE baris per baris secara lebih teliti.' },
      { key: 'B', text: 'Karena TRUNCATE melepaskan alokasi data pages secara langsung di tingkat storage engine tanpa mencatat transaksi rollback per baris, sehingga jauh lebih cepat dan mereset auto-increment.' },
      { key: 'C', text: 'Karena TRUNCATE dapat membatalkan penghapusan secara otomatis jika terjadi crash.' },
      { key: 'D', text: 'Karena TRUNCATE mempertahankan indeks dan trigger tanpa perlu hak akses ALTER.' },
      { key: 'E', text: 'Karena TRUNCATE mengubah tabel menjadi berkas arsip terkompresi.' }
    ],
    correctAnswer: 'B',
    explanation: '`TRUNCATE` adalah perintah DDL yang mengosongkan tabel dengan cara mendealokasi halaman data pada media penyimpanan, jauh lebih cepat daripada DML `DELETE` yang mencatat transaksi per baris (*row-by-row logging*).'
  },
  {
    id: 9,
    category: 'Data Definition Language (DDL)',
    question: 'Jika sebuah tabel `kategori` memiliki relasi referensial dengan tabel `produk` yang menggunakan opsi default `ON DELETE RESTRICT` (atau `NO ACTION`), apa yang terjadi saat kueri `DROP TABLE kategori;` dieksekusi secara langsung?',
    options: [
      { key: 'A', text: 'Tabel kategori berhasil dihapus dan seluruh produk berubah kategorinya menjadi NULL.' },
      { key: 'B', text: 'Tabel produk ikut terhapus secara otomatis dari skema database.' },
      { key: 'C', text: 'Database menolak perintah DROP TABLE dan memunculkan pesan error ketergantungan (dependency constraint error).' },
      { key: 'D', text: 'Database mengabaikan perintah dan hanya mengosongkan baris data saja.' },
      { key: 'E', text: 'Tabel kategori diubah statusnya menjadi read-only.' }
    ],
    correctAnswer: 'C',
    explanation: 'Tabel yang masih dijadikan rujukan foreign key oleh tabel lain tidak dapat langsung di-DROP karena akan merusak integritas referensial. Database akan memblokir perintah tersebut kecuali jika ditambahkan klausa `CASCADE`.'
  },

  // =========================================================================
  // KATEGORI 3: DATA MANIPULATION LANGUAGE / DML (No 10 - 13)
  // =========================================================================
  {
    id: 10,
    category: 'Data Manipulation Language (DML)',
    question: 'Perusahaan ingin menaikkan gaji seluruh karyawan pada departemen "IT" sebesar 15%, dan mengubah statusnya menjadi "Senior" jika masa kerjanya di atas 5 tahun. Perintah DML SQL yang paling tepat dan valid adalah...',
    codeSnippet: 'UPDATE karyawan \nSET gaji = gaji * 1.15, status_kerja = \'Senior\' \nWHERE departemen = \'IT\' AND masa_kerja_tahun > 5;',
    options: [
      { key: 'A', text: 'Sintaks kueri tersebut sudah benar dan hanya memperbarui data karyawan IT dengan masa kerja > 5 tahun.' },
      { key: 'B', text: 'Kueri salah karena perintah UPDATE tidak boleh memperbarui lebih dari satu kolom sekaligus.' },
      { key: 'C', text: 'Kueri salah karena kata kunci SET harus ditulis ulang untuk setiap kolom yang diperbarui.' },
      { key: 'D', text: 'Kueri akan memperbarui seluruh karyawan tanpa memedulikan departemen karena klausa AND.' },
      { key: 'E', text: 'Kueri salah karena tanda kutip pada kata Senior harus menggunakan tanda kutip ganda ("Senior").' }
    ],
    correctAnswer: 'A',
    explanation: 'Perintah `UPDATE` mengizinkan pengubahan beberapa kolom sekaligus dengan pemisah koma dalam satu klausa `SET`, dan klausa `WHERE` membatasi modifikasi hanya pada baris yang memenuhi kedua kriteria (`AND`).'
  },
  {
    id: 11,
    category: 'Data Manipulation Language (DML)',
    question: 'Perhatikan kueri penambahan data berikut. Bagaimana cara menyisipkan beberapa baris (*multiple rows*) sekaligus ke dalam tabel `mata_pelajaran` dalam satu kali eksekusi kueri yang baku?',
    options: [
      { key: 'A', text: 'INSERT INTO mata_pelajaran (kode, nama) VALUES (\'RPL01\', \'Basis Data\'), (\'RPL02\', \'PBO\'), (\'RPL03\', \'Web Framework\');' },
      { key: 'B', text: 'INSERT VALUES (\'RPL01\', \'Basis Data\') AND (\'RPL02\', \'PBO\') INTO mata_pelajaran;' },
      { key: 'C', text: 'INSERT MULTIPLE INTO mata_pelajaran SET (\'RPL01\', \'Basis Data\');' },
      { key: 'D', text: 'INSERT INTO mata_pelajaran VALUES [(\'RPL01\', \'Basis Data\'), (\'RPL02\', \'PBO\')];' },
      { key: 'E', text: 'APPEND INTO mata_pelajaran (kode, nama) VALUES (\'RPL01\', \'Basis Data\') + (\'RPL02\', \'PBO\');' }
    ],
    correctAnswer: 'A',
    explanation: 'Standar SQL mendukung multi-row insert dengan memisahkan tupel nilai menggunakan koma setelah kata kunci `VALUES`: `INSERT INTO tabel (kolom...) VALUES (...), (...), (...);`.'
  },
  {
    id: 12,
    category: 'Data Manipulation Language (DML)',
    question: 'Jika Anda ingin mengambil data transaksi pada halaman ke-3 (nomor urut 21 sampai 30) dengan asumsi per halaman menampilkan 10 data yang diurutkan berdasarkan `waktu_transaksi` terbaru, kombinasi klausa yang tepat adalah...',
    codeSnippet: 'SELECT * FROM transaksi \nORDER BY waktu_transaksi DESC \nLIMIT ... OFFSET ...;',
    options: [
      { key: 'A', text: 'LIMIT 10 OFFSET 20;' },
      { key: 'B', text: 'LIMIT 20 OFFSET 10;' },
      { key: 'C', text: 'LIMIT 30 OFFSET 20;' },
      { key: 'D', text: 'LIMIT 10 OFFSET 30;' },
      { key: 'E', text: 'LIMIT 3 OFFSET 10;' }
    ],
    correctAnswer: 'A',
    explanation: 'Pada pagination basis data, `LIMIT` menentukan jumlah data per halaman (10), sedangkan `OFFSET` melompati data sebelumnya. Halaman ke-3 melompati (3 - 1) * 10 = 20 data, sehingga `LIMIT 10 OFFSET 20;`.'
  },
  {
    id: 13,
    category: 'Data Manipulation Language (DML)',
    question: 'Manakah cara yang benar untuk mencari seluruh nama siswa yang mengandung kata "Kurnia", tidak sensitif terhadap huruf besar/kecil (case-insensitive) pada database PostgreSQL?',
    options: [
      { key: 'A', text: 'SELECT * FROM siswa WHERE nama LIKE \'%Kurnia%\';' },
      { key: 'B', text: 'SELECT * FROM siswa WHERE nama ILIKE \'%kurnia%\';' },
      { key: 'C', text: 'SELECT * FROM siswa WHERE nama = \'*Kurnia*\';' },
      { key: 'D', text: 'SELECT * FROM siswa WHERE nama CONTAINS \'kurnia\';' },
      { key: 'E', text: 'SELECT * FROM siswa WHERE nama MATCHES \'%kurnia%\';' }
    ],
    correctAnswer: 'B',
    explanation: 'Di PostgreSQL, operator `ILIKE` digunakan untuk pencarian pola string yang case-insensitive. Karakter `%` adalah wildcard untuk mencocokkan sembarang urutan karakter.'
  },

  // =========================================================================
  // KATEGORI 4: OPERATOR, FILTERING & FUNGSI AGREGASI (No 14 - 18)
  // =========================================================================
  {
    id: 14,
    category: 'Operator & Fungsi Agregasi',
    question: 'Perhatikan kondisi filter berikut. Manakah baris data yang lolos jika kueri dieksekusi?',
    codeSnippet: 'SELECT * FROM produk \nWHERE harga BETWEEN 50000 AND 100000 \n  AND kategori IN (\'Elektronik\', \'Aksesoris\') \n  AND garansi IS NOT NULL;',
    options: [
      { key: 'A', text: 'Produk seharga 50.000, kategori "Elektronik", dan garansi bernilai NULL.' },
      { key: 'B', text: 'Produk seharga 100.000, kategori "Aksesoris", dan garansi bernilai "1 Tahun".' },
      { key: 'C', text: 'Produk seharga 45.000, kategori "Aksesoris", dan garansi bernilai "6 Bulan".' },
      { key: 'D', text: 'Produk seharga 105.000, kategori "Elektronik", dan garansi bernilai "2 Tahun".' },
      { key: 'E', text: 'Produk seharga 75.000, kategori "Fashion", dan garansi bernilai "Tidak Ada".' }
    ],
    correctAnswer: 'B',
    explanation: 'Operator `BETWEEN 50000 AND 100000` bersifat inklusif (50.000 dan 100.000 termasuk). Kategori "Aksesoris" ada di dalam `IN`, dan nilai garansi bukan NULL (`IS NOT NULL`).'
  },
  {
    id: 15,
    category: 'Operator & Fungsi Agregasi',
    question: 'Tabel `pesanan` memiliki 10 baris data. Kolom `diskon` memiliki nilai: 10, 20, NULL, 30, NULL, 10, 0, 40, NULL, 20. Apa hasil dari fungsi agregasi `COUNT(diskon)` dan `COUNT(*)`?',
    options: [
      { key: 'A', text: 'COUNT(diskon) = 10, dan COUNT(*) = 10' },
      { key: 'B', text: 'COUNT(diskon) = 7, dan COUNT(*) = 10' },
      { key: 'C', text: 'COUNT(diskon) = 6, dan COUNT(*) = 7' },
      { key: 'D', text: 'COUNT(diskon) = 7, dan COUNT(*) = 7' },
      { key: 'E', text: 'COUNT(diskon) = NULL, dan COUNT(*) = 10' }
    ],
    correctAnswer: 'B',
    explanation: 'Fungsi `COUNT(*)` menghitung seluruh baris fisik tanpa memedulikan nilai NULL (total 10). Sedangkan `COUNT(nama_kolom)` hanya menghitung baris yang nilainya tidak NULL (10 baris - 3 NULL = 7).'
  },
  {
    id: 16,
    category: 'Operator & Fungsi Agregasi',
    question: 'Seorang analis ingin mengetahui rata-rata harga produk per kategori, namun jika ada produk yang harganya belum ditentukan (NULL), harga tersebut harus dianggap bernilai 0. Fungsi SQL standar yang tepat untuk mengganti nilai NULL adalah...',
    codeSnippet: 'SELECT kategori, AVG( COALESCE(harga, 0) ) AS rata_rata \nFROM produk \nGROUP BY kategori;',
    options: [
      { key: 'A', text: 'COALESCE(harga, 0)' },
      { key: 'B', text: 'ISNULL(harga = 0)' },
      { key: 'C', text: 'IFNULL_OR_FAIL(harga, 0)' },
      { key: 'D', text: 'NULL_REPLACE(harga, 0)' },
      { key: 'E', text: 'ZERO_FILL(harga)' }
    ],
    correctAnswer: 'A',
    explanation: 'Fungsi `COALESCE(ekspresi1, ekspresi2, ...)` adalah standar ANSI-SQL yang mengembalikan argumen pertama yang bernilai non-NULL. Jika harga NULL, maka nilai 0 yang digunakan.'
  },
  {
    id: 17,
    category: 'Operator & Fungsi Agregasi',
    question: 'Manakah kueri yang menghasilkan nilai total pendapatan kotor (*gross revenue*) dari tabel detail_transaksi yang dihitung dari (jumlah_barang * harga_satuan) dikurangi potongan diskon?',
    options: [
      { key: 'A', text: 'SELECT SUM(jumlah_barang * harga_satuan - diskon) AS total_pendapatan FROM detail_transaksi;' },
      { key: 'B', text: 'SELECT COUNT(jumlah_barang * harga_satuan) - SUM(diskon) FROM detail_transaksi;' },
      { key: 'C', text: 'SELECT TOTAL(jumlah_barang * harga_satuan - diskon) FROM detail_transaksi;' },
      { key: 'D', text: 'SELECT AVG(jumlah_barang * harga_satuan) - diskon FROM detail_transaksi;' },
      { key: 'E', text: 'SELECT MULTIPLY(jumlah_barang, harga_satuan) FROM detail_transaksi;' }
    ],
    correctAnswer: 'A',
    explanation: 'Fungsi `SUM()` menghitung total penjumlahan matematis dari ekspresi aritmetika `(jumlah_barang * harga_satuan - diskon)` untuk seluruh baris yang terpilih.'
  },
  {
    id: 18,
    category: 'Operator & Fungsi Agregasi',
    question: 'Apa perbedaan mendasar antara klausa WHERE dan HAVING dalam kueri SQL?',
    options: [
      { key: 'A', text: 'WHERE hanya digunakan pada tabel tunggal, sedangkan HAVING digunakan khusus untuk multi-tabel JOIN.' },
      { key: 'B', text: 'WHERE memfilter baris sebelum proses pengelompokan (GROUP BY) dan tidak dapat memuat fungsi agregasi, sedangkan HAVING memfilter hasil kelompok setelah agregasi dihitung.' },
      { key: 'C', text: 'WHERE dieksekusi setelah pengurutan ORDER BY, sedangkan HAVING dieksekusi sebelum SELECT.' },
      { key: 'D', text: 'WHERE wajib menggunakan operator logika OR, sedangkan HAVING hanya mendukung AND.' },
      { key: 'E', text: 'Tidak ada perbedaan sama sekali, keduanya dapat saling menggantikan secara bebas.' }
    ],
    correctAnswer: 'B',
    explanation: '`WHERE` menyaring baris individual sebelum pengelompokan dilakukan (tidak boleh memuat fungsi agregasi seperti SUM/AVG). Sebaliknya, `HAVING` menyaring kelompok data (*group*) setelah kalkulasi agregasi dilakukan.'
  },

  // =========================================================================
  // KATEGORI 5: MULTI-TABLE & JOIN (No 19 - 23)
  // =========================================================================
  {
    id: 19,
    category: 'JOIN & Relasi Multi-Tabel',
    question: 'Toko ingin menampilkan SEMUA data pelanggan yang terdaftar di sistem, baik yang pernah melakukan transaksi belanja maupun yang belum pernah belanja sama sekali. Jenis JOIN yang paling tepat adalah...',
    codeSnippet: 'SELECT p.id, p.nama_pelanggan, t.nomor_transaksi \nFROM pelanggan p \n... transaksi t ON p.id = t.id_pelanggan;',
    options: [
      { key: 'A', text: 'INNER JOIN' },
      { key: 'B', text: 'LEFT JOIN (atau LEFT OUTER JOIN)' },
      { key: 'C', text: 'RIGHT JOIN' },
      { key: 'D', text: 'CROSS JOIN' },
      { key: 'E', text: 'NATURAL INNER JOIN' }
    ],
    correctAnswer: 'B',
    explanation: '`LEFT JOIN` mengembalikan semua baris dari tabel kiri (`pelanggan`), meskipun tidak ada baris yang cocok di tabel kanan (`transaksi`). Kolom dari tabel kanan akan bernilai `NULL` bagi pelanggan yang belum pernah bertransaksi.'
  },
  {
    id: 20,
    category: 'JOIN & Relasi Multi-Tabel',
    question: 'Perhatikan kueri berikut. Teknik kueri ini digunakan untuk mendeteksi data pelanggan yang BELUM PERNAH melakukan transaksi sama sekali. Kondisi apakah yang harus melengkapi klausa WHERE?',
    codeSnippet: 'SELECT p.nama_pelanggan, p.email \nFROM pelanggan p \nLEFT JOIN transaksi t ON p.id = t.id_pelanggan \nWHERE ...;',
    options: [
      { key: 'A', text: 't.id IS NULL' },
      { key: 'B', text: 't.id IS NOT NULL' },
      { key: 'C', text: 't.id = 0' },
      { key: 'D', text: 'p.id IS NULL' },
      { key: 'E', text: 'COUNT(t.id) = 0' }
    ],
    correctAnswer: 'A',
    explanation: 'Kombinasi `LEFT JOIN` dengan filter `WHERE t.id IS NULL` adalah pola umum (*anti-join*) untuk menemukan data di tabel kiri yang tidak memiliki pasangan rujukan di tabel kanan.'
  },
  {
    id: 21,
    category: 'JOIN & Relasi Multi-Tabel',
    question: 'Tabel `siswa` memiliki 30 baris dan tabel `ekskul` memiliki 5 baris. Jika seorang programmer menjalankan kueri CROSS JOIN tanpa kondisi penghubung, berapa baris data yang akan dihasilkan?',
    codeSnippet: 'SELECT s.nama_siswa, e.nama_ekskul \nFROM siswa s \nCROSS JOIN ekskul e;',
    options: [
      { key: 'A', text: '35 baris (30 + 5)' },
      { key: 'B', text: '25 baris (30 - 5)' },
      { key: 'C', text: '150 baris (30 * 5)' },
      { key: 'D', text: '6 baris (30 / 5)' },
      { key: 'E', text: '30 baris' }
    ],
    correctAnswer: 'C',
    explanation: '`CROSS JOIN` menghasilkan perkalian kartesian (*Cartesian Product*), di mana setiap baris tabel pertama dipasangkan dengan setiap baris tabel kedua: 30 * 5 = 150 baris.'
  },
  {
    id: 22,
    category: 'JOIN & Relasi Multi-Tabel',
    question: 'Perhatikan skema 3 tabel: `mahasiswa`, `krs`, dan `mata_kuliah`. Kueri yang benar untuk menampilkan nama mahasiswa beserta nama mata kuliah yang diambilnya adalah...',
    options: [
      { key: 'A', text: 'SELECT m.nama, mk.nama_mk FROM mahasiswa m JOIN krs k ON m.nim = k.nim JOIN mata_kuliah mk ON k.kode_mk = mk.kode_mk;' },
      { key: 'B', text: 'SELECT m.nama, mk.nama_mk FROM mahasiswa m JOIN mata_kuliah mk ON m.nim = mk.kode_mk;' },
      { key: 'C', text: 'SELECT m.nama, mk.nama_mk FROM mahasiswa m, mata_kuliah mk WHERE m.nim = mk.kode_mk;' },
      { key: 'D', text: 'SELECT m.nama, mk.nama_mk FROM krs k LEFT JOIN mahasiswa m ON k.id = m.id;' },
      { key: 'E', text: 'SELECT m.nama, mk.nama_mk FROM mahasiswa m MERGE mata_kuliah mk USING krs;' }
    ],
    correctAnswer: 'A',
    explanation: 'Untuk menghubungkan relasi Many-to-Many melalui tabel perantara `krs`, diperlukan dua tahap `JOIN`: pertama menghubungkan `mahasiswa` ke `krs` (`m.nim = k.nim`), kemudian menghubungkan `krs` ke `mata_kuliah` (`k.kode_mk = mk.kode_mk`).'
  },
  {
    id: 23,
    category: 'JOIN & Relasi Multi-Tabel',
    question: 'Pada tabel `karyawan`, terdapat kolom `id_manajer` yang merujuk kembali ke kolom `id_karyawan` pada tabel yang sama. Operasi relasional untuk menampilkan nama karyawan beserta nama atasannya (manajernya) disebut...',
    codeSnippet: 'SELECT k.nama AS staf, m.nama AS atasan \nFROM karyawan k \nLEFT JOIN karyawan m ON k.id_manajer = m.id_karyawan;',
    options: [
      { key: 'A', text: 'Semi JOIN' },
      { key: 'B', text: 'Full Outer JOIN' },
      { key: 'C', text: 'Self JOIN' },
      { key: 'D', text: 'Recursive UNION' },
      { key: 'E', text: 'Natural Equi-JOIN' }
    ],
    correctAnswer: 'C',
    explanation: '`Self JOIN` adalah teknik melakukan operasi JOIN antara suatu tabel dengan dirinya sendiri menggunakan alias tabel yang berbeda, sangat umum digunakan untuk struktur data hierarki seperti relasi karyawan dan manajer.'
  },

  // =========================================================================
  // KATEGORI 6: PENGELOMPOKAN & SUBQUERY (No 24 - 26)
  // =========================================================================
  {
    id: 24,
    category: 'Pengelompokan & Subquery',
    question: 'Manajer penjualan ingin menampilkan daftar kategori produk yang memiliki rata-rata harga di atas Rp 200.000, diurutkan dari yang termahal. Kueri SQL yang valid adalah...',
    options: [
      { key: 'A', text: 'SELECT kategori, AVG(harga) FROM produk WHERE AVG(harga) > 200000 GROUP BY kategori;' },
      { key: 'B', text: 'SELECT kategori, AVG(harga) AS rata_harga FROM produk GROUP BY kategori HAVING AVG(harga) > 200000 ORDER BY rata_harga DESC;' },
      { key: 'C', text: 'SELECT kategori, AVG(harga) FROM produk HAVING harga > 200000 GROUP BY kategori;' },
      { key: 'D', text: 'SELECT kategori, AVG(harga) FROM produk GROUP BY kategori WHERE harga > 200000;' },
      { key: 'E', text: 'SELECT kategori FROM produk WHERE SUM(harga) > 200000 GROUP BY AVG(harga);' }
    ],
    correctAnswer: 'B',
    explanation: 'Penyaringan terhadap hasil fungsi agregasi (`AVG(harga) > 200000`) harus diletakkan di klausa `HAVING` setelah `GROUP BY kategori`, bukan di klausa `WHERE`.'
  },
  {
    id: 25,
    category: 'Pengelompokan & Subquery',
    question: 'Perhatikan kueri subquery berikut. Subquery jenis apakah yang bergantung pada nilai baris dari kueri luar (*outer query*) pada setiap iterasinya?',
    codeSnippet: 'SELECT p.id, p.nama_produk, p.harga \nFROM produk p \nWHERE p.harga > (\n  SELECT AVG(sub.harga) \n  FROM produk sub \n  WHERE sub.id_kategori = p.id_kategori\n);',
    options: [
      { key: 'A', text: 'Scalar Independent Subquery' },
      { key: 'B', text: 'Correlated Subquery (Kueri Berkorelasi)' },
      { key: 'C', text: 'Inline Table Subquery' },
      { key: 'D', text: 'Uncorrelated Cartesian Subquery' },
      { key: 'E', text: 'Recursive View Subquery' }
    ],
    correctAnswer: 'B',
    explanation: 'Correlated Subquery adalah subquery yang mengevaluasi baris demi baris berdasarkan nilai atribut dari query luar (`sub.id_kategori = p.id_kategori`).'
  },
  {
    id: 26,
    category: 'Pengelompokan & Subquery',
    question: 'Kueri yang menggunakan operator `EXISTS` menghasilkan nilai TRUE jika...',
    codeSnippet: 'SELECT nama FROM pelanggan p \nWHERE EXISTS (\n  SELECT 1 FROM pesanan o WHERE o.id_pelanggan = p.id\n);',
    options: [
      { key: 'A', text: 'Subquery mengembalikan setidaknya satu baris data (*at least one row*).' },
      { key: 'B', text: 'Seluruh nilai pada kolom pesanan tidak ada yang bernilai NULL.' },
      { key: 'C', text: 'Subquery mengembalikan nilai angka 1 yang bernilai eksak.' },
      { key: 'D', text: 'Tabel pesanan memiliki struktur kolom yang identik dengan pelanggan.' },
      { key: 'E', text: 'Jumlah baris pada tabel pesanan sama persis dengan tabel pelanggan.' }
    ],
    correctAnswer: 'A',
    explanation: 'Operator `EXISTS` mengecek keberadaan baris pada subquery. Operator ini mengembalikan nilai boolean `TRUE` segera setelah menemukan minimal satu baris yang cocok, menjadikannya sangat efisien.'
  },

  // =========================================================================
  // KATEGORI 7: NORMALISASI & ANOMALI DATA (No 27 - 28)
  // =========================================================================
  {
    id: 27,
    category: 'Normalisasi & Anomali Data',
    question: 'Sebuah tabel pesanan menyimpan data nomor telepon pelanggan berupa deretan angka yang dipisahkan koma dalam satu sel (misal: "0812345, 0856789, 0878901"). Pelanggaran bentuk normal keberapakah kondisi tersebut dan apa syarat pemenuhannya?',
    options: [
      { key: 'A', text: 'Melanggar Bentuk Normal Pertama (1NF), karena 1NF mensyaratkan setiap kolom harus bernilai atomik (tidak boleh ada repeating group atau multi-value attribute).' },
      { key: 'B', text: 'Melanggar Bentuk Normal Kedua (2NF), karena belum memiliki Foreign Key.' },
      { key: 'C', text: 'Melanggar Bentuk Normal Ketiga (3NF), karena terjadi ketergantungan transitif antarkolom non-kunci.' },
      { key: 'D', text: 'Melanggar Boyce-Codd Normal Form (BCNF), karena determinan bukan super key.' },
      { key: 'E', text: 'Tabel tersebut sudah memenuhi bentuk normal dan siap digunakan di sistem produksi.' }
    ],
    correctAnswer: 'A',
    explanation: 'First Normal Form (1NF) mewajibkan setiap nilai dalam sel atribut bersifat atomik (tunggal dan tidak dapat dipecah lagi), serta meniadakan kumpulan atribut berulang (*repeating groups*).'
  },
  {
    id: 28,
    category: 'Normalisasi & Anomali Data',
    question: 'Suatu tabel dikatakan telah memenuhi Bentuk Normal Kedua (2NF) jika telah memenuhi 1NF dan...',
    options: [
      { key: 'A', text: 'Tidak memiliki atribut yang bernilai NULL.' },
      { key: 'B', text: 'Setiap atribut non-kunci bergantung sepenuhnya secara fungsional pada seluruh Primary Key (*no partial dependency*).' },
      { key: 'C', text: 'Tidak ada ketergantungan transitif antarsesama atribut non-kunci.' },
      { key: 'D', text: 'Setiap tabel wajib memiliki minimal 3 kolom foreign key.' },
      { key: 'E', text: 'Data disimpan dalam format file JSON BSON.' }
    ],
    correctAnswer: 'B',
    explanation: 'Bentuk Normal Kedua (2NF) mensyaratkan tabel sudah 1NF dan tidak memiliki Ketergantungan Parsial (*Partial Functional Dependency*), artinya seluruh atribut non-kunci harus bergantung penuh pada seluruh bagian Primary Key.'
  },

  // =========================================================================
  // KATEGORI 8: TRANSAKSI ACID & ARSITEKTUR DB (No 29 - 30)
  // =========================================================================
  {
    id: 29,
    category: 'Transaksi ACID & Arsitektur DB',
    question: 'Dalam transaksi perbankan, proses transfer saldo Rp 500.000 dari Rekening A ke Rekening B melibatkan dua tahap: pemotongan saldo Rekening A dan penambahan saldo Rekening B. Jika server mati mendadak setelah pemotongan saldo A sebelum saldo B bertambah, sistem harus membatalkan seluruh operasi sehingga saldo A kembali utuh. Prinsip ACID manakah yang menjamin aturan "semua berhasil atau tidak ada sama sekali" (*all-or-nothing*)?',
    options: [
      { key: 'A', text: 'Consistency (Konsistensi)' },
      { key: 'B', text: 'Isolation (Isolasi)' },
      { key: 'C', text: 'Atomicity (Keutuhan / Atomisitas)' },
      { key: 'D', text: 'Durability (Daya Tahan)' },
      { key: 'E', text: 'Concurrency (Keserempakan)' }
    ],
    correctAnswer: 'C',
    explanation: '`Atomicity` (Atomisitas) menjamin bahwa transaksi dieksekusi sebagai satu kesatuan utuh tak terpisahkan: jika salah satu langkah gagal, seluruh perubahan yang telah dilakukan harus di-`ROLLBACK` ke status awal.'
  },
  {
    id: 30,
    category: 'Transaksi ACID & Arsitektur DB',
    question: 'Perhatikan pembuatan Index pada tabel besar berikut. Kapan sebuah kolom pada tabel sebaiknya diberikan B-Tree Index oleh Database Administrator?',
    codeSnippet: 'CREATE INDEX idx_pelanggan_email ON pelanggan(email);',
    options: [
      { key: 'A', text: 'Pada kolom yang sangat jarang dicari dan tabelnya hanya berisi kurang dari 10 baris.' },
      { key: 'B', text: 'Pada kolom yang sering digunakan dalam klausa WHERE, JOIN, atau ORDER BY pada tabel berukuran besar, untuk mempercepat waktu pencarian dari Full Table Scan menjadi Index Scan.' },
      { key: 'C', text: 'Pada seluruh kolom tanpa terkecuali, karena index tidak memakan ruang memori sama sekali.' },
      { key: 'D', text: 'Khusus pada kolom teks panjang bertipe BLOB atau LONGTEXT saja.' },
      { key: 'E', text: 'Hanya ketika tabel berada dalam status read-only permanen.' }
    ],
    correctAnswer: 'B',
    explanation: 'Index (seperti B-Tree) secara drastis mempercepat kueri pencarian (`WHERE`), relasi (`JOIN`), dan pengurutan (`ORDER BY`) pada tabel berukuran besar dengan menghindari pemindaian seluruh tabel (*full table scan*).'
  }
];
