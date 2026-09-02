export interface SqlOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface SqlTryoutQuestion {
  id: number;
  category: 'Dasar DML' | 'Operator & Agregasi' | 'JOIN & Relasi' | 'Pengelompokan & Subquery' | 'Arsitektur, DDL & ACID';
  question: string;
  codeSnippet?: string;
  options: SqlOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
}

export const sqlTryoutQuestions: SqlTryoutQuestion[] = [
  // --- KATEGORI 1: DASAR DML ---
  {
    id: 1,
    category: 'Dasar DML',
    question: 'Sebuah toko ingin menampilkan daftar kota asal pelanggan tanpa ada nama kota yang muncul berulang kali (duplikat). Perintah SQL yang paling tepat adalah...',
    codeSnippet: '-- Pilihan kueri untuk mengambil daftar kota unik dari tabel pelanggan\nSELECT ... kota FROM pelanggan;',
    options: [
      { key: 'A', text: 'SELECT UNIQUE kota FROM pelanggan;' },
      { key: 'B', text: 'SELECT DISTINCT kota FROM pelanggan;' },
      { key: 'C', text: 'SELECT DIFFERENT kota FROM pelanggan;' },
      { key: 'D', text: 'SELECT SINGLE kota FROM pelanggan;' },
      { key: 'E', text: 'SELECT ALL kota FROM pelanggan GROUP BY ALL;' }
    ],
    correctAnswer: 'B',
    explanation: 'Kata kunci standar dalam SQL untuk menghilangkan duplikasi baris pada hasil kueri adalah `DISTINCT`. Penulisan yang benar adalah `SELECT DISTINCT kota FROM pelanggan;`.'
  },
  {
    id: 2,
    category: 'Dasar DML',
    question: 'Perhatikan kueri SQL berikut ini. Jika kueri dijalankan tanpa klausa WHERE, apa dampak yang terjadi pada tabel produk?',
    codeSnippet: 'UPDATE produk \nSET harga_jual = harga_jual * 1.1;',
    options: [
      { key: 'A', text: 'Kueri akan otomatis gagal (error) karena klausa WHERE bersifat wajib pada perintah UPDATE.' },
      { key: 'B', text: 'Hanya baris pertama pada tabel produk yang harga jualnya naik 10%.' },
      { key: 'C', text: 'Hanya produk dengan stok lebih dari 0 yang harga jualnya naik 10%.' },
      { key: 'D', text: 'Seluruh baris data produk di dalam tabel akan mengalami kenaikan harga jual sebesar 10%.' },
      { key: 'E', text: 'Tabel produk akan terhapus dan dibuat ulang dengan harga baru.' }
    ],
    correctAnswer: 'D',
    explanation: 'Perintah `UPDATE` tanpa klausa `WHERE` akan mengeksekusi perubahan data pada SELURUH baris (*all rows*) yang ada di tabel tersebut. Ini adalah salah satu kesalahan paling fatal jika tidak dilakukan secara sengaja.'
  },
  {
    id: 3,
    category: 'Dasar DML',
    question: 'Manakah perbedaan utama yang paling tepat antara perintah DELETE dan TRUNCATE pada basis data relasional?',
    options: [
      { key: 'A', text: 'DELETE menghapus struktur tabel dan datanya sekaligus, sedangkan TRUNCATE hanya menghapus datanya saja.' },
      { key: 'B', text: 'DELETE dapat menggunakan klausa WHERE untuk menghapus sebagian data dan dicatat di log baris per baris (DML), sedangkan TRUNCATE menghapus seluruh baris sekaligus dengan mereset alokasi halaman tabel (DDL).' },
      { key: 'C', text: 'DELETE tidak bisa di-rollback, sedangkan TRUNCATE selalu bisa di-rollback secara otomatis.' },
      { key: 'D', text: 'DELETE adalah perintah DDL, sedangkan TRUNCATE adalah perintah DML.' },
      { key: 'E', text: 'TRUNCATE memerlukan izin hak akses yang lebih rendah dibandingkan DELETE.' }
    ],
    correctAnswer: 'B',
    explanation: '`DELETE` tergolong DML yang dapat memfilter baris dengan `WHERE` dan mencatat log penghapusan per baris. Sedangkan `TRUNCATE` tergolong DDL yang mengosongkan seluruh tabel secara instan (deallocate data pages) dan biasanya mereset auto-increment sequence.'
  },
  {
    id: 4,
    category: 'Dasar DML',
    question: 'Di bawah ini sintaks INSERT INTO yang paling tepat untuk memasukkan data baru secara spesifik pada kolom tertentu adalah...',
    options: [
      { key: 'A', text: 'INSERT INTO siswa (nama, jurusan) VALUES ("Ahmad", "RPL");' },
      { key: 'B', text: 'ADD INTO siswa (nama, jurusan) VALUES (\'Ahmad\', \'RPL\');' },
      { key: 'C', text: 'INSERT IN siswa (nama, jurusan) SET (\'Ahmad\', \'RPL\');' },
      { key: 'D', text: 'INSERT INTO siswa (nama, jurusan) VALUES (\'Ahmad\', \'RPL\');' },
      { key: 'E', text: 'PUT INTO siswa VALUES (nama = \'Ahmad\', jurusan = \'RPL\');' }
    ],
    correctAnswer: 'D',
    explanation: 'Sintaks baku SQL untuk memasukkan data baru adalah `INSERT INTO nama_tabel (kolom1, kolom2) VALUES (\'nilai1\', \'nilai2\');`. Dalam SQL standar, nilai string diapit menggunakan tanda petik tunggal (\').'
  },
  {
    id: 5,
    category: 'Dasar DML',
    question: 'Jika ingin mengurutkan data transaksi berdasarkan nominal total_belanja dari yang paling mahal ke paling murah, dan jika nominalnya sama diurutkan berdasarkan tanggal_transaksi terbaru, klausa ORDER BY yang tepat adalah...',
    options: [
      { key: 'A', text: 'ORDER BY total_belanja ASC, tanggal_transaksi ASC' },
      { key: 'B', text: 'ORDER BY total_belanja DESC, tanggal_transaksi DESC' },
      { key: 'C', text: 'ORDER BY total_belanja HIGH, tanggal_transaksi NEW' },
      { key: 'D', text: 'ORDER BY total_belanja DESC, tanggal_transaksi ASC' },
      { key: 'E', text: 'SORT BY total_belanja DESCENDING, tanggal_transaksi DESCENDING' }
    ],
    correctAnswer: 'B',
    explanation: 'Pengurutan dari nilai terbesar ke terkecil menggunakan keyword `DESC` (Descending). Jika nilai kolom pertama sama, SQL akan mengevaluasi kolom kedua yang juga menggunakan `DESC` untuk tanggal paling baru (terbesar).'
  },

  // --- KATEGORI 2: OPERATOR & AGREGASI ---
  {
    id: 6,
    category: 'Operator & Agregasi',
    question: 'Seorang administrator ingin mencari pelanggan yang nama depannya diawali huruf "A" dan memiliki panjang minimal 4 karakter. Pola LIKE yang tepat adalah...',
    options: [
      { key: 'A', text: "WHERE nama LIKE 'A%'" },
      { key: 'B', text: "WHERE nama LIKE 'A___%'" },
      { key: 'C', text: "WHERE nama LIKE 'A____'" },
      { key: 'D', text: "WHERE nama LIKE 'A*3*'" },
      { key: 'E', text: "WHERE nama LIKE '%A___'" }
    ],
    correctAnswer: 'B',
    explanation: 'Dalam SQL, karakter underscore (`_`) mewakili tepat 1 sembarang karakter, dan persentase (`%`) mewakili 0 atau lebih karakter. `A___%` berarti huruf A diikuti minimal 3 karakter lagi (total minimal 1+3 = 4 karakter) lalu boleh diikuti karakter apapun.'
  },
  {
    id: 7,
    category: 'Operator & Agregasi',
    question: 'Bagaimana perilaku fungsi agregasi COUNT(nama_kolom) saat menemukan baris yang bernilai NULL pada kolom tersebut?',
    options: [
      { key: 'A', text: 'Baris bernilai NULL akan dihitung sebagai angka 0.' },
      { key: 'B', text: 'Baris bernilai NULL akan menyebabkan kueri error (NullPointerException).' },
      { key: 'C', text: 'Baris bernilai NULL akan diabaikan (tidak dimasukkan dalam hitungan).' },
      { key: 'D', text: 'Fungsi COUNT(nama_kolom) otomatis mengubah nilai NULL menjadi string kosong.' },
      { key: 'E', text: 'Fungsi COUNT akan mengembalikan nilai NULL jika ada satu saja data NULL.' }
    ],
    correctAnswer: 'C',
    explanation: '`COUNT(nama_kolom)` hanya menghitung baris yang memiliki nilai (Non-NULL). Baris yang bernilai `NULL` akan otomatis diabaikan. Berbeda dengan `COUNT(*)`, yang menghitung total seluruh baris tanpa peduli isi kolom.'
  },
  {
    id: 8,
    category: 'Operator & Agregasi',
    question: 'Perhatikan kondisi filter SQL berikut. Manakah kueri yang menghasilkan cakupan data yang PERSIS SAMA dengan kondisi BETWEEN?',
    codeSnippet: 'SELECT * FROM produk \nWHERE harga_jual BETWEEN 10000 AND 50000;',
    options: [
      { key: 'A', text: 'WHERE harga_jual > 10000 AND harga_jual < 50000' },
      { key: 'B', text: 'WHERE harga_jual >= 10000 AND harga_jual <= 50000' },
      { key: 'C', text: 'WHERE harga_jual >= 10000 OR harga_jual <= 50000' },
      { key: 'D', text: 'WHERE harga_jual > 10000 OR harga_jual < 50000' },
      { key: 'E', text: 'WHERE harga_jual IN (10000, 50000)' }
    ],
    correctAnswer: 'B',
    explanation: 'Operator `BETWEEN val1 AND val2` dalam SQL bersifat *inclusive*, artinya batas bawah (10000) dan batas atas (50000) ikut dihitung. Ini setara dengan operator `>= 10000 AND <= 50000`.'
  },
  {
    id: 9,
    category: 'Operator & Agregasi',
    question: 'Perhatikan tabel nilai berikut: jika kolom nilai memiliki data [80, 90, NULL, 70], berapa hasil yang dikembalikan oleh kueri AVG(nilai)?',
    codeSnippet: 'SELECT AVG(nilai) FROM ujian;',
    options: [
      { key: 'A', text: '60 (karena (80 + 90 + 0 + 70) / 4 = 60)' },
      { key: 'B', text: 'NULL (karena ada satu nilai NULL)' },
      { key: 'C', text: '80 (karena (80 + 90 + 70) / 3 = 80)' },
      { key: 'D', text: 'Error karena fungsi agregat tidak dapat memproses data NULL' },
      { key: 'E', text: '75 (nilai tengah / median)' }
    ],
    correctAnswer: 'C',
    explanation: 'Fungsi `AVG()` mengabaikan baris `NULL` baik pada pembilang (jumlah total) maupun penyebut (jumlah pembagi). Sehingga perhitungannya adalah (80 + 90 + 70) / 3 = 240 / 3 = 80.'
  },
  {
    id: 10,
    category: 'Operator & Agregasi',
    question: 'Kueri yang benar untuk mencari produk dengan kategori id_kategori 1, 3, atau 7 yang stoknya masih di atas 10 adalah...',
    options: [
      { key: 'A', text: 'WHERE id_kategori = 1 OR 3 OR 7 AND stok > 10' },
      { key: 'B', text: 'WHERE id_kategori IN (1, 3, 7) AND stok > 10' },
      { key: 'C', text: 'WHERE id_kategori BETWEEN (1, 3, 7) AND stok > 10' },
      { key: 'D', text: 'WHERE id_kategori LIKE (1, 3, 7) AND stok > 10' },
      { key: 'E', text: 'WHERE id_kategori HAS (1, 3, 7) OR stok > 10' }
    ],
    correctAnswer: 'B',
    explanation: 'Operator `IN (val1, val2, ...)` digunakan untuk mencocokkan nilai terhadap sekumpulan daftar pilihan (*list of values*). Dikombinasikan dengan `AND stok > 10` untuk memenuhi kedua kriteria secara bersamaan.'
  },

  // --- KATEGORI 3: JOIN & RELASI TABEL ---
  {
    id: 11,
    category: 'JOIN & Relasi',
    question: 'Manakah jenis JOIN yang HANYA menampilkan baris data yang memiliki pasangan nilai cocok (matching key) di kedua tabel?',
    options: [
      { key: 'A', text: 'LEFT OUTER JOIN' },
      { key: 'B', text: 'RIGHT OUTER JOIN' },
      { key: 'C', text: 'INNER JOIN' },
      { key: 'D', text: 'FULL OUTER JOIN' },
      { key: 'E', text: 'CROSS JOIN' }
    ],
    correctAnswer: 'C',
    explanation: '`INNER JOIN` hanya mengembalikan baris-baris data yang memenuhi kondisi relasi (kondisi `ON`) di kedua tabel. Jika ada baris di tabel kiri atau kanan yang tidak punya pasangan, baris tersebut tidak akan ditampilkan.'
  },
  {
    id: 12,
    category: 'JOIN & Relasi',
    question: 'Toko ingin mencari daftar pelanggan yang BELUM PERNAH melakukan transaksi sama sekali. Kueri SQL yang paling efektif adalah...',
    codeSnippet: 'SELECT p.nama_pelanggan \nFROM pelanggan p\nLEFT JOIN transaksi t ON p.id_pelanggan = t.id_pelanggan\nWHERE ... ;',
    options: [
      { key: 'A', text: 'WHERE t.id_transaksi = 0' },
      { key: 'B', text: 'WHERE t.id_transaksi IS NULL' },
      { key: 'C', text: 'WHERE t.id_transaksi != NULL' },
      { key: 'D', text: 'WHERE COUNT(t.id_transaksi) = 0' },
      { key: 'E', text: 'WHERE p.id_pelanggan NOT IN t.id_pelanggan' }
    ],
    correctAnswer: 'B',
    explanation: 'Ketika menggunakan `LEFT JOIN`, pelanggan yang belum pernah bertransaksi akan menghasilkan baris dengan kolom tabel transaksi bernilai `NULL`. Oleh karena itu, kita memfilter dengan `WHERE t.id_transaksi IS NULL`.'
  },
  {
    id: 13,
    category: 'JOIN & Relasi',
    question: 'Jika Tabel A memiliki 5 baris dan Tabel B memiliki 4 baris, berapa jumlah baris hasil jika kueri dieksekusi menggunakan CROSS JOIN tanpa kondisi ON?',
    codeSnippet: 'SELECT * FROM tabel_a CROSS JOIN tabel_b;',
    options: [
      { key: 'A', text: '9 baris (5 + 4)' },
      { key: 'B', text: '1 baris (selisih)' },
      { key: 'C', text: '20 baris (5 * 4)' },
      { key: 'D', text: '5 baris (mengikuti tabel kiri)' },
      { key: 'E', text: '0 baris (karena tidak ada kondisi ON)' }
    ],
    correctAnswer: 'C',
    explanation: '`CROSS JOIN` menghasilkan perkalian kartesian (*Cartesian Product*), yaitu memasangkan setiap baris di Tabel A dengan setiap baris di Tabel B. Jumlah barisnya adalah 5 x 4 = 20 baris.'
  },
  {
    id: 14,
    category: 'JOIN & Relasi',
    question: 'Perhatikan relasi berikut: Tabel karyawan memiliki kolom id_karyawan dan id_manajer (di mana manajer juga merupakan karyawan di tabel yang sama). Jenis JOIN apa yang digunakan untuk menampilkan nama karyawan beserta nama manajernya?',
    options: [
      { key: 'A', text: 'Natural Join' },
      { key: 'B', text: 'Self Join' },
      { key: 'C', text: 'Equi Join' },
      { key: 'D', text: 'Cross Join' },
      { key: 'E', text: 'Semi Join' }
    ],
    correctAnswer: 'B',
    explanation: '`Self Join` adalah teknik menggabungkan suatu tabel dengan dirinya sendiri (menggunakan alias tabel berbeda, misal `karyawan k` dan `karyawan m`) untuk membaca struktur hierarki rekursif dalam satu tabel.'
  },
  {
    id: 15,
    category: 'JOIN & Relasi',
    question: 'Mengapa pada sistem POS ritel diperlukan tabel perantara detail_transaksi antara tabel transaksi dan produk?',
    options: [
      { key: 'A', text: 'Karena satu transaksi hanya boleh membeli satu jenis produk saja (Relasi 1:1).' },
      { key: 'B', text: 'Untuk memecah relasi Banyak-ke-Banyak (Many-to-Many / M:N) menjadi dua buah relasi Satu-ke-Banyak (1:N).' },
      { key: 'C', text: 'Agar database tidak memerlukan Primary Key pada tabel transaksi.' },
      { key: 'D', text: 'Sebagai syarat mutlak agar database dapat berjalan pada sistem operasi Linux.' },
      { key: 'E', text: 'Untuk menghindari penggunaan tipe data DECIMAL pada harga.' }
    ],
    correctAnswer: 'B',
    explanation: 'Satu nota transaksi dapat memuat banyak produk, dan satu jenis produk dapat terjual di banyak nota transaksi (Relasi M:N). Dalam RDBMS, relasi M:N wajib dipecah menggunakan Junction Table / Detail Table menjadi dua relasi 1:N.'
  },

  // --- KATEGORI 4: PENGELOMPOKAN & SUBQUERY ---
  {
    id: 16,
    category: 'Pengelompokan & Subquery',
    question: 'Manakah aturan penting yang WAJIB dipatuhi saat menulis kueri dengan klausa GROUP BY?',
    options: [
      { key: 'A', text: 'Klausa WHERE tidak boleh digunakan bersamaan dengan GROUP BY.' },
      { key: 'B', text: 'Semua kolom non-agregat yang tercantum pada klausa SELECT wajib dicantumkan pada klausa GROUP BY.' },
      { key: 'C', text: 'GROUP BY hanya dapat digunakan untuk tabel yang memiliki kurang dari 100 baris.' },
      { key: 'D', text: 'Klausa ORDER BY harus diletakkan persis sebelum GROUP BY.' },
      { key: 'E', text: 'Fungsi SUM() dan AVG() tidak boleh berada dalam kueri GROUP BY.' }
    ],
    correctAnswer: 'B',
    explanation: 'Dalam SQL standar (termasuk PostgreSQL), setiap kolom yang dipilih di klausa `SELECT` yang BUKAN merupakan fungsi agregasi (seperti `SUM`, `COUNT`, `AVG`) WAJIB didaftarkan ke dalam klausa `GROUP BY`.'
  },
  {
    id: 17,
    category: 'Pengelompokan & Subquery',
    question: 'Perhatikan kueri berikut. Mengapa kueri ini menghasilkan sintaks error pada SQL?',
    codeSnippet: 'SELECT id_kategori, COUNT(*) AS total_produk \nFROM produk \nWHERE COUNT(*) > 5 \nGROUP BY id_kategori;',
    options: [
      { key: 'A', text: 'Alias total_produk tidak boleh menggunakan huruf kecil.' },
      { key: 'B', text: 'Klausa WHERE tidak dapat memfilter hasil dari fungsi agregasi; seharusnya menggunakan klausa HAVING.' },
      { key: 'C', text: 'Klausa GROUP BY harus diletakkan sebelum klausa FROM.' },
      { key: 'D', text: 'Fungsi COUNT(*) tidak boleh menerima angka pembanding lebih dari 5.' },
      { key: 'E', text: 'Kategori produk tidak boleh dihitung dengan COUNT(*).' }
    ],
    correctAnswer: 'B',
    explanation: 'Klausa `WHERE` dieksekusi SEBELUM baris data dikelompokkan (sehingga tidak mengenal fungsi agregat). Untuk memfilter hasil setelah agregasi/pengelompokan, kita WAJIB menggunakan klausa `HAVING COUNT(*) > 5`.'
  },
  {
    id: 18,
    category: 'Pengelompokan & Subquery',
    question: 'Kueri berikut ini menggunakan konsep subquery. Apa tujuan utama dari kueri di bawah ini?',
    codeSnippet: 'SELECT nama_produk, harga_jual \nFROM produk \nWHERE harga_jual > (SELECT AVG(harga_jual) FROM produk);',
    options: [
      { key: 'A', text: 'Mencari produk yang harganya paling murah di seluruh toko.' },
      { key: 'B', text: 'Menghitung rata-rata harga jual seluruh produk toko.' },
      { key: 'C', text: 'Menampilkan daftar produk yang harga jualnya berada di atas rata-rata harga seluruh produk.' },
      { key: 'D', text: 'Mengubah harga produk agar bernilai sama dengan nilai rata-rata.' },
      { key: 'E', text: 'Menghapus produk yang harganya terlalu mahal dari database.' }
    ],
    correctAnswer: 'C',
    explanation: 'Subquery `(SELECT AVG(harga_jual) FROM produk)` menghasilkan sebuah nilai skalar (rata-rata harga). Kueri utama kemudian memfilter produk yang memiliki `harga_jual` lebih besar dari nilai rata-rata tersebut.'
  },
  {
    id: 19,
    category: 'Pengelompokan & Subquery',
    question: 'Manakah keunggulan operator EXISTS dibandingkan operator IN pada subquery yang memproses volume data besar?',
    options: [
      { key: 'A', text: 'EXISTS selalu mengembalikan seluruh baris data ke memori RAM.' },
      { key: 'B', text: 'EXISTS melakukan pencarian berbasis "Short-Circuit", yaitu langsung berhenti mencari begitu menemukan 1 baris yang cocok tanpa perlu memindai seluruh subquery.' },
      { key: 'C', text: 'EXISTS tidak mendukung klausa WHERE pada subquery.' },
      { key: 'D', text: 'EXISTS hanya bekerja pada tipe data teks (VARCHAR).' },
      { key: 'E', text: 'IN selalu lebih cepat daripada EXISTS di semua situasi basis data.' }
    ],
    correctAnswer: 'B',
    explanation: 'Operator `EXISTS` mengevaluasi keberadaan baris secara boolean (TRUE/FALSE). Begitu menemukan kecocokan pertama (first match), mesin RDBMS langsung menghentikan evaluasi (early exit / short-circuit), menjadikannya sangat efisien.'
  },
  {
    id: 20,
    category: 'Pengelompokan & Subquery',
    question: 'Urutan eksekusi logika (Logical Query Processing Order) yang benar pada RDBMS saat memproses kueri SQL adalah...',
    options: [
      { key: 'A', text: 'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY' },
      { key: 'B', text: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY' },
      { key: 'C', text: 'FROM -> SELECT -> WHERE -> ORDER BY -> GROUP BY -> HAVING' },
      { key: 'D', text: 'WHERE -> FROM -> GROUP BY -> SELECT -> HAVING -> ORDER BY' },
      { key: 'E', text: 'ORDER BY -> SELECT -> FROM -> WHERE -> GROUP BY -> HAVING' }
    ],
    correctAnswer: 'B',
    explanation: 'Urutan eksekusi logika di database engine: 1. FROM (ambil data tabel) -> 2. WHERE (filter baris) -> 3. GROUP BY (kelompokkan) -> 4. HAVING (filter agregat) -> 5. SELECT (proyeksikan kolom) -> 6. ORDER BY (urutkan hasil).'
  },

  // --- KATEGORI 5: ARSITEKTUR, DDL & ACID ---
  {
    id: 21,
    category: 'Arsitektur, DDL & ACID',
    question: 'Pada perancangan tabel basis data ritel SmartMart, batasan (constraint) manakah yang paling tepat untuk memastikan harga jual produk selalu lebih besar atau sama dengan harga beli?',
    options: [
      { key: 'A', text: 'FOREIGN KEY (harga_jual) REFERENCES produk(harga_beli)' },
      { key: 'B', text: 'CHECK (harga_jual >= harga_beli)' },
      { key: 'C', text: 'UNIQUE (harga_jual, harga_beli)' },
      { key: 'D', text: 'DEFAULT (harga_jual >= harga_beli)' },
      { key: 'E', text: 'NOT NULL (harga_jual >= harga_beli)' }
    ],
    correctAnswer: 'B',
    explanation: '`CHECK constraint` digunakan untuk memvalidasi kondisi logika bisnis pada suatu kolom atau antar-kolom sebelum data disimpan ke database. Penulisan `CHECK (harga_jual >= harga_beli)` mencegah kerugian akibat salah input kasir.'
  },
  {
    id: 22,
    category: 'Arsitektur, DDL & ACID',
    question: 'Jika relasi Foreign Key antara tabel transaksi (induk) dan detail_transaksi (anak) diatur dengan ON DELETE CASCADE, apa yang terjadi ketika satu baris nota transaksi dihapus?',
    options: [
      { key: 'A', text: 'Penghapusan nota transaksi ditolak oleh database jika detail barangnya masih ada.' },
      { key: 'B', text: 'Nota transaksi terhapus, dan semua baris detail_transaksi yang terkait dengan nota tersebut otomatis ikut terhapus permanen.' },
      { key: 'C', text: 'Kolom id_transaksi pada detail_transaksi diubah menjadi bernilai NULL.' },
      { key: 'D', text: 'Tabel produk yang dibeli di dalam transaksi ikut terhapus dari katalog toko.' },
      { key: 'E', text: 'Database akan mengalami crash dan terkunci total.' }
    ],
    correctAnswer: 'B',
    explanation: '`ON DELETE CASCADE` memastikan integritas referensial dengan menghapus seluruh data turunan (child rows) pada tabel detail_transaksi secara otomatis begitu data induk (parent row) pada tabel transaksi dihapus.'
  },
  {
    id: 23,
    category: 'Arsitektur, DDL & ACID',
    question: 'Sebuah tabel transaksi kasir berada dalam kondisi Bentuk Normal Kedua (2NF). Syarat mutlak apa yang harus dipenuhi agar tabel tersebut naik ke Bentuk Normal Ketiga (3NF)?',
    options: [
      { key: 'A', text: 'Tabel tidak boleh memiliki kolom bertipe data VARCHAR.' },
      { key: 'B', text: 'Tabel sudah memenuhi 2NF dan tidak memiliki ketergantungan transitif (kolom non-PK tidak boleh bergantung pada kolom non-PK lainnya).' },
      { key: 'C', text: 'Tabel harus memiliki minimal 10 kolom dengan 3 Foreign Key.' },
      { key: 'D', text: 'Semua nilai kolom harus berupa array yang dapat menyimpan multi-nilai.' },
      { key: 'E', text: 'Tabel harus disimpan pada memori cache RAM saja tanpa ditulis ke hard disk.' }
    ],
    correctAnswer: 'B',
    explanation: 'Syarat 3NF (Third Normal Form): 1. Sudah memenuhi 2NF, dan 2. Menghilangkan ketergantungan transitif (transitive dependency), yaitu kondisi di mana atribut non-key bergantung pada atribut non-key lainnya (contoh: nama_kategori harus dipisah ke tabel kategori tersendiri, bukan menempel di tabel produk).'
  },
  {
    id: 24,
    category: 'Arsitektur, DDL & ACID',
    question: 'Dalam prinsip ACID pada sistem transaksi RDBMS, sifat "Atomicity" memiliki arti bahwa...',
    options: [
      { key: 'A', text: 'Semua query harus selesai dieksekusi dalam waktu kurang dari 1 milidetik.' },
      { key: 'B', text: 'Transaksi harus dijalankan sebagai satu kesatuan utuh: berhasil seluruhnya atau dibatalkan sama sekali tanpa ada perubahan separuh jalan (All or Nothing).' },
      { key: 'C', text: 'Data transaksi otomatis dikompresi menjadi ukuran terkecil di hard disk.' },
      { key: 'D', text: 'Setiap kasir memiliki hak akses yang persis sama dengan administrator basis data.' },
      { key: 'E', text: 'Transaksi hanya bisa dilakukan pada satu komputer tunggal.' }
    ],
    correctAnswer: 'B',
    explanation: '`Atomicity` menjamin bahwa sekumpulan perintah dalam satu transaksi (misal: simpan nota + potong stok + catat pembayaran) harus tuntas seluruhnya (COMMIT) atau jika terjadi kendala/mati listrik, semua perubahan dikembalikan ke kondisi awal (ROLLBACK).'
  },
  {
    id: 25,
    category: 'Arsitektur, DDL & ACID',
    question: 'Manakah perintah DDL yang benar untuk menambahkan kolom baru nomor_telepon VARCHAR(20) ke dalam tabel kasir yang sudah ada di database?',
    options: [
      { key: 'A', text: 'UPDATE TABLE kasir ADD COLUMN nomor_telepon VARCHAR(20);' },
      { key: 'B', text: 'ALTER TABLE kasir ADD COLUMN nomor_telepon VARCHAR(20);' },
      { key: 'C', text: 'INSERT INTO kasir ADD nomor_telepon VARCHAR(20);' },
      { key: 'D', text: 'MODIFY TABLE kasir NEW nomor_telepon VARCHAR(20);' },
      { key: 'E', text: 'CREATE COLUMN nomor_telepon VARCHAR(20) IN kasir;' }
    ],
    correctAnswer: 'B',
    explanation: 'Perintah DDL untuk memodifikasi struktur tabel yang sudah ada adalah `ALTER TABLE nama_tabel ADD COLUMN nama_kolom tipe_data;`.'
  }
];
