export interface SQLLesson {
  id: number;
  slug: string;
  title: string;
  category: string;
  path_id: 'basics' | 'aggregates' | 'joins' | 'grouping' | 'ddl_security';
  order_index: number;
  theory_markdown: string;
  instructions_markdown: string;
  seed_sql: string;
  expected_sql: string;
  initial_code: string;
  evaluator_type: 'data_match' | 'schema_match';
}

export const seedLessons: SQLLesson[] = [
  // PATH 1: SQL BASICS (1 - 10)
  {
    id: 1,
    slug: 'sql-select-all',
    title: 'Pengenalan Perintah SELECT',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 1,
    theory_markdown: `# Perintah SELECT

Perintah **SELECT** digunakan untuk mengambil data dari database. Data yang dikembalikan disimpan dalam tabel hasil, yang disebut *result-set*.

### Sintaksis:
\`\`\`sql
SELECT column1, column2, ...
FROM table_name;
\`\`\`

Jika Anda ingin mengambil **seluruh kolom** yang ada dalam tabel, Anda dapat menggunakan tanda bintang (\`*\`):
\`\`\`sql
SELECT * FROM table_name;
\`\`\`

### Contoh Tabel Customers:
Tabel \`customers\` menyimpan daftar pelanggan toko online dengan kolom: \`id\`, \`name\`, \`city\`, dan \`country\`.`,
    instructions_markdown: 'Tulis query SQL untuk mengambil dan menampilkan **seluruh kolom dan baris** dari tabel `customers`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');`,
    expected_sql: 'SELECT * FROM customers;',
    initial_code: '-- Tulis query SQL Anda di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 2,
    slug: 'sql-select-distinct',
    title: 'Filter Nilai Unik dengan SELECT DISTINCT',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 2,
    theory_markdown: `# Perintah SELECT DISTINCT

Pernyataan **SELECT DISTINCT** digunakan untuk mengembalikan hanya nilai-nilai yang berbeda (unik).

Dalam sebuah tabel, suatu kolom sering kali berisi banyak nilai duplikat; dan terkadang Anda hanya ingin mendaftar nilai-nilai unik saja.

### Sintaksis:
\`\`\`sql
SELECT DISTINCT column1, column2, ...
FROM table_name;
\`\`\``,
    instructions_markdown: 'Tampilkan nilai unik dari kolom **country** pada tabel `customers`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Smith', 'Kuala Lumpur', 'Malaysia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (5, 'Mei Ling', 'Singapore', 'Singapore');`,
    expected_sql: 'SELECT DISTINCT country FROM customers;',
    initial_code: '-- Tulis query SELECT DISTINCT di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 3,
    slug: 'sql-where-clause',
    title: 'Filter Data Menggunakan WHERE',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 3,
    theory_markdown: `# Klausul WHERE

Klausul **WHERE** digunakan untuk memfilter record data. Klausul ini digunakan untuk mengambil hanya record yang memenuhi kondisi tertentu.

### Sintaksis:
\`\`\`sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
\`\`\`

> **Catatan:** Klausul \`WHERE\` tidak hanya digunakan dalam perintah \`SELECT\`, tetapi juga digunakan dalam \`UPDATE\`, \`DELETE\`, dan lainnya!

### Operator dalam Klausul WHERE:
- \`=\` : Sama dengan
- \`>\` : Lebih besar dari
- \`<\` : Lebih kecil dari
- \`>=\` : Lebih besar dari atau sama dengan
- \`<=\` : Lebih kecil dari atau sama dengan
- \`<>\` : Tidak sama dengan (Pada beberapa versi SQL dapat ditulis \`!=\`)`,
    instructions_markdown: "Tulis query SQL untuk menampilkan seluruh data pelanggan dari tabel `customers` yang berdomisili di kota **'Bandung'**.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "SELECT * FROM customers WHERE city = 'Bandung';",
    initial_code: '-- Tulis query SELECT dengan klausul WHERE di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 4,
    slug: 'sql-and-or-not',
    title: 'Logika Kombinasi dengan AND, OR, NOT',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 4,
    theory_markdown: `# Operator AND, OR, dan NOT

Klausul **WHERE** dapat dikombinasikan dengan operator **AND**, **OR**, dan **NOT**.

- **AND**: Menampilkan record jika SEMUA kondisi dipisahkan oleh AND bernilai TRUE.
- **OR**: Menampilkan record jika SALAH SATU kondisi bernilai TRUE.
- **NOT**: Menampilkan record jika kondisi TIDAK TRUE.

### Sintaksis:
\`\`\`sql
SELECT * FROM table_name WHERE condition1 AND condition2;
SELECT * FROM table_name WHERE condition1 OR condition2;
SELECT * FROM table_name WHERE NOT condition;
\`\`\``,
    instructions_markdown: "Tampilkan seluruh pelanggan dari tabel `customers` yang berasal dari negara **'Indonesia'** AND berdomisili di kota **'Jakarta'**.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'Andi Wijaya', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (4, 'John Doe', 'Singapore', 'Singapore');`,
    expected_sql: "SELECT * FROM customers WHERE country = 'Indonesia' AND city = 'Jakarta';",
    initial_code: '-- Tulis query dengan operator AND di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 5,
    slug: 'sql-order-by',
    title: 'Mengurutkan Data dengan ORDER BY',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 5,
    theory_markdown: `# Perintah ORDER BY

Kata kunci **ORDER BY** digunakan untuk mengurutkan hasil query secara ascending (menaik) atau descending (menurun).

Secara default, kata kunci \`ORDER BY\` mengurutkan record secara **ascending (ASC)**. Untuk mengurutkan record secara descending, gunakan kata kunci **DESC**.

### Sintaksis:
\`\`\`sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC|DESC;
\`\`\``,
    instructions_markdown: 'Tampilkan seluruh data pelanggan dari tabel `customers` diurutkan berdasarkan **name** secara alfabetis naik (**ASC**).',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Ahmad Dahlan', 'Yogyakarta', 'Indonesia');
INSERT INTO customers VALUES (3, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (4, 'Citra Dewi', 'Surabaya', 'Indonesia');`,
    expected_sql: 'SELECT * FROM customers ORDER BY name ASC;',
    initial_code: '-- Tulis query dengan ORDER BY di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 6,
    slug: 'sql-insert-into',
    title: 'Menambahkan Data Baru dengan INSERT INTO',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 6,
    theory_markdown: `# Perintah INSERT INTO

Perintah **INSERT INTO** digunakan untuk menyisipkan/menambahkan record baru ke dalam tabel.

### Terdapat Dua Cara Penulisan INSERT INTO:

1. **Menentukan nama kolom dan nilai yang akan dimasukkan:**
\`\`\`sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
\`\`\`

2. **Jika menambahkan nilai untuk seluruh kolom tabel:**
\`\`\`sql
INSERT INTO table_name
VALUES (value1, value2, value3, ...);
\`\`\``,
    instructions_markdown: "Tambahkan pelanggan baru ke tabel `customers` dengan rincian data berikut:\n- `id`: 5\n- `name`: `'Eko Prasetyo'`\n- `city`: `'Semarang'`\n- `country`: `'Indonesia'`\n\nSetelah baris `INSERT INTO`, tuliskan perintah `SELECT * FROM customers;` di baris berikutnya agar perubahan tabel dapat ditampilkan.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "INSERT INTO customers (id, name, city, country) VALUES (5, 'Eko Prasetyo', 'Semarang', 'Indonesia'); SELECT * FROM customers;",
    initial_code: '-- Tambahkan data baru dengan INSERT INTO lalu tampilkan dengan SELECT * FROM customers;\n',
    evaluator_type: 'data_match',
  },
  {
    id: 7,
    slug: 'sql-null-values',
    title: 'Penanganan Data Kosong dengan IS NULL / IS NOT NULL',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 7,
    theory_markdown: `# Nilai NULL dalam SQL

Nilai **NULL** menunjukkan bahwa suatu bidang/kolom tidak memiliki nilai (kosong).

Untuk memeriksa apakah suatu kolom bernilai NULL atau tidak, kita TIDAK BISA menggunakan operator perbandingan seperti \`=\` atau \`<>\`. Kita harus menggunakan **IS NULL** dan **IS NOT NULL**.

### Sintaksis:
\`\`\`sql
SELECT column_names FROM table_name WHERE column_name IS NULL;
SELECT column_names FROM table_name WHERE column_name IS NOT NULL;
\`\`\``,
    instructions_markdown: 'Tampilkan seluruh pelanggan dari tabel `customers` yang kolom **phone** bernilai **IS NULL**.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, phone TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', '08123456789');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', NULL);
INSERT INTO customers VALUES (3, 'Andi Wijaya', 'Surabaya', NULL);
INSERT INTO customers VALUES (4, 'Rina Permata', 'Medan', '08987654321');`,
    expected_sql: 'SELECT * FROM customers WHERE phone IS NULL;',
    initial_code: '-- Tulis query dengan IS NULL di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 8,
    slug: 'sql-update-data',
    title: 'Memperbarui Data dengan UPDATE',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 8,
    theory_markdown: `# Perintah UPDATE

Perintah **UPDATE** digunakan untuk mengubah/memperbarui record yang sudah ada dalam tabel.

### Sintaksis:
\`\`\`sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
\`\`\`

> **PERATURAN PENTING:**
> Hati-hati saat memperbarui record dalam tabel! Perhatikan klausul \`WHERE\` dalam perintah \`UPDATE\`. Klausul \`WHERE\` menentukan record mana yang harus diperbarui. Jika Anda menghilangkan klausul \`WHERE\`, **SEMUA record dalam tabel akan diperbarui!**`,
    instructions_markdown: "Perbarui (UPDATE) data pelanggan pada tabel `customers` yang memiliki `id = 3` sehingga kolom `city` berubah menjadi **'Bali'**. Setelah perintah `UPDATE`, tambahkan `SELECT * FROM customers;` di baris berikutnya untuk menampilkan tabel hasil.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "UPDATE customers SET city = 'Bali' WHERE id = 3; SELECT * FROM customers;",
    initial_code: '-- Tulis perintah UPDATE dan SELECT * FROM customers di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 9,
    slug: 'sql-delete-data',
    title: 'Menghapus Data dengan DELETE',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 9,
    theory_markdown: `# Perintah DELETE

Perintah **DELETE** digunakan untuk menghapus baris/record yang sudah ada dalam tabel.

### Sintaksis:
\`\`\`sql
DELETE FROM table_name WHERE condition;
\`\`\`

> **PERATURAN PENTING:** Hati-hati saat menghapus record! Jika Anda menghilangkan klausul \`WHERE\`, seluruh baris dalam tabel akan terhapus!`,
    instructions_markdown: 'Hapus data pelanggan dari tabel `customers` yang memiliki `id = 2`. Setelah perintah DELETE, jalankan `SELECT * FROM customers;` untuk menampilkan sisa data.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');`,
    expected_sql: 'DELETE FROM customers WHERE id = 2; SELECT * FROM customers;',
    initial_code: '-- Tulis perintah DELETE dan SELECT * FROM customers di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 10,
    slug: 'sql-limit-clause',
    title: 'Membatasi Baris Data dengan LIMIT',
    category: 'Level 1: SQL Basics',
    path_id: 'basics',
    order_index: 10,
    theory_markdown: `# Klausul LIMIT

Klausul **LIMIT** digunakan untuk membatasi jumlah record data yang dikembalikan oleh query.

Klausul ini sangat berguna pada tabel besar dengan ribuan record agar query berjalan cepat.

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table_name
WHERE condition
LIMIT number;
\`\`\``,
    instructions_markdown: 'Tampilkan **3 pelanggan pertama** dari tabel `customers` diurutkan berdasarkan `id` secara menaik (`ASC`).',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Budi'), (2, 'Siti'), (3, 'Andi'), (4, 'Dewi'), (5, 'Eko');`,
    expected_sql: 'SELECT * FROM customers ORDER BY id ASC LIMIT 3;',
    initial_code: '-- Tulis query dengan klausul LIMIT di bawah ini:\n',
    evaluator_type: 'data_match',
  },

  // PATH 2: SQL AGGREGATES & FUNCTIONS (11 - 18)
  {
    id: 11,
    slug: 'sql-min-max',
    title: 'Mencari Nilai Minimum & Maksimum dengan MIN() & MAX()',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 11,
    theory_markdown: `# Fungsi MIN() dan MAX()

- **MIN()**: Mengembalikan nilai terkecil dari kolom yang dipilih.
- **MAX()**: Mengembalikan nilai terbesar dari kolom yang dipilih.

### Sintaksis:
\`\`\`sql
SELECT MIN(column_name) FROM table_name WHERE condition;
SELECT MAX(column_name) FROM table_name WHERE condition;
\`\`\``,
    instructions_markdown: 'Tulis query SQL untuk menampilkan harga termurah (**MIN(price)**) dan harga termahal (**MAX(price)**) dari tabel `products`.',
    seed_sql: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'Laptop', 12000000), (2, 'Mouse', 150000), (3, 'Keyboard', 450000), (4, 'Monitor', 2500000);`,
    expected_sql: 'SELECT MIN(price), MAX(price) FROM products;',
    initial_code: '-- Tulis query MIN(price) dan MAX(price) di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 12,
    slug: 'sql-count-func',
    title: 'Menghitung Jumlah Record dengan COUNT()',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 12,
    theory_markdown: `# Fungsi COUNT()

Fungsi **COUNT()** mengembalikan jumlah baris yang memenuhi kriteria tertentu.

### Sintaksis:
\`\`\`sql
SELECT COUNT(column_name) FROM table_name WHERE condition;
\`\`\``,
    instructions_markdown: 'Hitung total jumlah produk pada tabel `products` yang memiliki harga lebih besar dari **200000**.',
    seed_sql: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'Laptop', 12000000), (2, 'Mouse', 150000), (3, 'Keyboard', 450000), (4, 'Monitor', 2500000);`,
    expected_sql: 'SELECT COUNT(*) FROM products WHERE price > 200000;',
    initial_code: '-- Tulis query COUNT(*) di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 13,
    slug: 'sql-sum-func',
    title: 'Menghitung Total Jumlah dengan SUM()',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 13,
    theory_markdown: `# Fungsi SUM()

Fungsi **SUM()** mengembalikan total jumlah dari sebuah kolom numerik.

### Sintaksis:
\`\`\`sql
SELECT SUM(column_name) FROM table_name WHERE condition;
\`\`\``,
    instructions_markdown: 'Hitung total seluruh stok barang (**SUM(quantity)**) pada tabel `inventory`.',
    seed_sql: `CREATE TABLE inventory (id INT, item_name TEXT, quantity INT);
INSERT INTO inventory VALUES (1, 'Buku Tulis', 50), (2, 'Pensil', 120), (3, 'Penggaris', 30), (4, 'Spidol', 45);`,
    expected_sql: 'SELECT SUM(quantity) FROM inventory;',
    initial_code: '-- Tulis query SUM(quantity) di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 14,
    slug: 'sql-avg-func',
    title: 'Menghitung Rata-rata dengan AVG()',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 14,
    theory_markdown: `# Fungsi AVG()

Fungsi **AVG()** mengembalikan nilai rata-rata (*average*) dari sebuah kolom numerik.

### Sintaksis:
\`\`\`sql
SELECT AVG(column_name) FROM table_name WHERE condition;
\`\`\``,
    instructions_markdown: 'Hitung nilai rata-rata ulasan produk (**AVG(rating)**) dari tabel `reviews`.',
    seed_sql: `CREATE TABLE reviews (id INT, product_id INT, rating REAL);
INSERT INTO reviews VALUES (1, 101, 4.5), (2, 101, 5.0), (3, 102, 3.5), (4, 102, 4.0), (5, 103, 5.0);`,
    expected_sql: 'SELECT AVG(rating) FROM reviews;',
    initial_code: '-- Tulis query AVG(rating) di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 15,
    slug: 'sql-like-operator',
    title: 'Pencarian Pola Teks dengan LIKE',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 15,
    theory_markdown: `# Operator LIKE

Operator **LIKE** digunakan dalam klausul \`WHERE\` untuk mencari pola tertentu dalam sebuah kolom teks.

### Dua Wildcard Utama:
- \`%\` : Mewakili nol, satu, atau banyak karakter.
- \`_\` : Mewakili satu karakter tunggal.

### Sintaksis:
\`\`\`sql
SELECT * FROM table_name WHERE column_name LIKE pattern;
\`\`\``,
    instructions_markdown: "Tampilkan seluruh pelanggan dari tabel `customers` yang namanya diawali dengan huruf **'A'** (`LIKE 'A%'`).",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Ahmad Dahlan', 'Yogyakarta'), (2, 'Budi Santoso', 'Jakarta'), (3, 'Andi Wijaya', 'Surabaya'), (4, 'Citra Dewi', 'Bandung');`,
    expected_sql: "SELECT * FROM customers WHERE name LIKE 'A%';",
    initial_code: '-- Tulis query dengan operator LIKE di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 16,
    slug: 'sql-wildcards',
    title: 'Penggunaan Wildcards % dan _',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 16,
    theory_markdown: `# Karakter Wildcard SQL

Wildcard digunakan untuk menggantikan satu atau lebih karakter pada pencarian pola string.

Contoh:
- \`WHERE name LIKE '_u%'\`: Karakter kedua harus huruf 'u'.
- \`WHERE code LIKE 'B__'\`: Diawali 'B' dan diikuti tepat 2 karakter.`,
    instructions_markdown: "Tampilkan pelanggan dari tabel `customers` yang memiliki huruf kedua berupa **'u'** (`LIKE '_u%'`).",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta'), (2, 'Siti Rahma', 'Bandung'), (3, 'Surya Utama', 'Medan'), (4, 'Andi Prasetya', 'Surabaya');`,
    expected_sql: "SELECT * FROM customers WHERE name LIKE '_u%';",
    initial_code: '-- Tulis query dengan wildcard di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 17,
    slug: 'sql-in-operator',
    title: 'Pencarian Banyak Nilai dengan IN',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 17,
    theory_markdown: `# Operator IN

Operator **IN** memungkinkan Anda menentukan banyak nilai dalam klausul \`WHERE\` tanpa perlu menuliskan banyak operator \`OR\`.

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1, value2, ...);
\`\`\``,
    instructions_markdown: "Tampilkan seluruh pelanggan dari tabel `customers` yang berada di kota **'Jakarta'**, **'Bandung'**, atau **'Surabaya'** menggunakan operator **IN**.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Budi', 'Jakarta'), (2, 'Siti', 'Bandung'), (3, 'Eko', 'Semarang'), (4, 'Andi', 'Surabaya'), (5, 'Rina', 'Medan');`,
    expected_sql: "SELECT * FROM customers WHERE city IN ('Jakarta', 'Bandung', 'Surabaya');",
    initial_code: '-- Tulis query dengan operator IN di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 18,
    slug: 'sql-between-operator',
    title: 'Pencarian Jangkauan Nilai dengan BETWEEN',
    category: 'Level 2: SQL Aggregates & Functions',
    path_id: 'aggregates',
    order_index: 18,
    theory_markdown: `# Operator BETWEEN

Operator **BETWEEN** memilih nilai dalam rentang tertentu. Nilainya bisa berupa angka, teks, atau tanggal.

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value1 AND value2;
\`\`\``,
    instructions_markdown: 'Tampilkan seluruh produk dari tabel `products` yang harganya berada di antara **100000** dan **500000** (inklusif).',
    seed_sql: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'Mouse', 150000), (2, 'Keyboard', 450000), (3, 'Webcam', 600000), (4, 'USB Cable', 50000), (5, 'Headset', 300000);`,
    expected_sql: 'SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;',
    initial_code: '-- Tulis query dengan BETWEEN di bawah ini:\n',
    evaluator_type: 'data_match',
  },

  // PATH 3: SQL JOINS & RELASI TABEL (19 - 24)
  {
    id: 19,
    slug: 'sql-aliases',
    title: 'Penamaan Alias Kolom & Tabel dengan AS',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 19,
    theory_markdown: `# Alias dalam SQL (AS)

Alias SQL digunakan untuk memberikan nama sementara pada tabel atau kolom agar lebih mudah dibaca.

### Sintaksis:
\`\`\`sql
SELECT column_name AS alias_name FROM table_name;
SELECT column_name FROM table_name AS alias_name;
\`\`\``,
    instructions_markdown: "Tampilkan kolom `name` sebagai **'nama_pelanggan'** dan `city` sebagai **'kota_asal'** dari tabel `customers`.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta'), (2, 'Siti Rahma', 'Bandung');`,
    expected_sql: 'SELECT name AS nama_pelanggan, city AS kota_asal FROM customers;',
    initial_code: '-- Tulis query dengan alias AS di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 20,
    slug: 'sql-inner-join',
    title: 'Penggabungan Data Dua Tabel dengan INNER JOIN',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 20,
    theory_markdown: `# INNER JOIN

Kata kunci **INNER JOIN** memilih record yang memiliki nilai yang cocok (*matching values*) di kedua tabel.

### Sintaksis:
\`\`\`sql
SELECT table1.column1, table2.column2...
FROM table1
INNER JOIN table2
ON table1.matching_column = table2.matching_column;
\`\`\``,
    instructions_markdown: 'Tampilkan `orders.id`, `customers.name`, dan `orders.amount` dengan menggabungkan tabel `orders` dan `customers` berdasarkan `customer_id`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, 'Budi'), (2, 'Siti'), (3, 'Andi');
INSERT INTO orders VALUES (101, 1, 500000), (102, 2, 750000), (103, 1, 250000);`,
    expected_sql: 'SELECT orders.id, customers.name, orders.amount FROM orders INNER JOIN customers ON orders.customer_id = customers.id;',
    initial_code: '-- Tulis query INNER JOIN di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 21,
    slug: 'sql-left-join',
    title: 'Penggabungan Data dengan LEFT JOIN',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 21,
    theory_markdown: `# LEFT JOIN

Kata kunci **LEFT JOIN** mengembalikan seluruh record dari tabel kiri (table1), dan record yang cocok dari tabel kanan (table2). Jika tidak ada yang cocok, hasilnya adalah NULL di sebelah kanan.

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name = table2.column_name;
\`\`\``,
    instructions_markdown: 'Tampilkan semua `customers.name` dan `orders.amount` (jika ada) menggunakan **LEFT JOIN** antara `customers` (tabel kiri) dan `orders` (tabel kanan) pada `customers.id = orders.customer_id`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, 'Budi'), (2, 'Siti'), (3, 'Andi');
INSERT INTO orders VALUES (101, 1, 500000);`,
    expected_sql: 'SELECT customers.name, orders.amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;',
    initial_code: '-- Tulis query LEFT JOIN di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 22,
    slug: 'sql-right-join',
    title: 'Penggabungan Data dengan RIGHT JOIN',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 22,
    theory_markdown: `# RIGHT JOIN

Kata kunci **RIGHT JOIN** mengembalikan seluruh record dari tabel kanan (table2), dan record yang cocok dari tabel kiri (table1).

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name = table2.column_name;
\`\`\`

> *Catatan SQLite*: Jika menggunakan SQLite / JS WASM, RIGHT JOIN disimulasikan atau didukung via sintaks LEFT JOIN terbalik atau sintaks standar.`,
    instructions_markdown: 'Tampilkan seluruh `orders.id` dan `customers.name` (jika ada) dengan menggunakan **LEFT JOIN** membalik tabel `orders` ke `customers` (atau RIGHT JOIN).',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, 'Budi');
INSERT INTO orders VALUES (101, 1, 500000), (102, 2, 300000);`,
    expected_sql: 'SELECT orders.id, customers.name FROM orders LEFT JOIN customers ON orders.customer_id = customers.id;',
    initial_code: '-- Tulis query penggabungan tabel di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 23,
    slug: 'sql-full-join',
    title: 'Penggabungan Data Lengkap dengan FULL JOIN',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 23,
    theory_markdown: `# FULL OUTER JOIN

Kata kunci **FULL OUTER JOIN** mengembalikan semua record ketika ada kecocokan di tabel kiri ATAU tabel kanan.

Di SQLite, \`FULL OUTER JOIN\` dikombinasikan menggunakan \`LEFT JOIN\` dan \`UNION\`.

### Contoh SQLite:
\`\`\`sql
SELECT customers.name, orders.amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id
UNION
SELECT customers.name, orders.amount FROM orders LEFT JOIN customers ON orders.customer_id = customers.id;
\`\`\``,
    instructions_markdown: 'Gabungkan tabel `customers` dan `orders` menggunakan `LEFT JOIN` gabungan `UNION` untuk menampilkan seluruh data gabungan `name` dan `amount`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, 'Budi'), (2, 'Siti');
INSERT INTO orders VALUES (101, 1, 500000), (102, 3, 400000);`,
    expected_sql: 'SELECT customers.name, orders.amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id UNION SELECT customers.name, orders.amount FROM orders LEFT JOIN customers ON orders.customer_id = customers.id;',
    initial_code: '-- Tulis query gabungan dengan UNION di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 24,
    slug: 'sql-union-operator',
    title: 'Menggabungkan Result-Set dengan UNION & UNION ALL',
    category: 'Level 3: SQL Joins & Relasi Tabel',
    path_id: 'joins',
    order_index: 24,
    theory_markdown: `# Operator UNION & UNION ALL

Operator **UNION** digunakan untuk menggabungkan hasil dari dua atau lebih pernyataan \`SELECT\`.

- **UNION**: Menggabungkan dan menghapus baris duplikat.
- **UNION ALL**: Menggabungkan dan mempertahankan baris duplikat.

### Sintaksis:
\`\`\`sql
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;
\`\`\``,
    instructions_markdown: 'Tampilkan daftar kota unik dari gabungan tabel `suppliers` (`city`) dan tabel `customers` (`city`) menggunakan **UNION**.',
    seed_sql: `CREATE TABLE customers (id INT, city TEXT);
CREATE TABLE suppliers (id INT, city TEXT);
INSERT INTO customers VALUES (1, 'Jakarta'), (2, 'Bandung');
INSERT INTO suppliers VALUES (1, 'Jakarta'), (2, 'Surabaya');`,
    expected_sql: 'SELECT city FROM customers UNION SELECT city FROM suppliers;',
    initial_code: '-- Tulis query UNION di bawah ini:\n',
    evaluator_type: 'data_match',
  },

  // PATH 4: SQL GROUPING & SUBQUERIES (25 - 30)
  {
    id: 25,
    slug: 'sql-group-by',
    title: 'Pengelompokan Data dengan GROUP BY',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 25,
    theory_markdown: `# Perintah GROUP BY

Pernyataan **GROUP BY** mengelompokkan baris yang memiliki nilai sama ke dalam baris rangkuman, seperti "temukan jumlah pelanggan di setiap negara".

Sering digunakan bersama fungsi agregat (\`COUNT()\`, \`MAX()\`, \`MIN()\`, \`SUM()\`, \`AVG()\`).

### Sintaksis:
\`\`\`sql
SELECT column_name(s), COUNT(*)
FROM table_name
GROUP BY column_name(s);
\`\`\``,
    instructions_markdown: 'Tampilkan kolom `country` dan jumlah pelanggan (**COUNT(*)**) untuk setiap negara dari tabel `customers` yang dikelompokkan berdasarkan `country`.',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi', 'Indonesia'), (2, 'Siti', 'Indonesia'), (3, 'John', 'Malaysia'), (4, 'Dewi', 'Indonesia'), (5, 'Mei', 'Singapore');`,
    expected_sql: 'SELECT country, COUNT(*) FROM customers GROUP BY country;',
    initial_code: '-- Tulis query GROUP BY di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 26,
    slug: 'sql-having-clause',
    title: 'Filter Kelompok Data dengan HAVING',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 26,
    theory_markdown: `# Klausul HAVING

Klausul **HAVING** ditambahkan ke SQL karena kata kunci \`WHERE\` tidak dapat digunakan bersama fungsi agregat.

### Sintaksis:
\`\`\`sql
SELECT column_name(s), COUNT(*)
FROM table_name
GROUP BY column_name(s)
HAVING COUNT(*) > value;
\`\`\``,
    instructions_markdown: 'Tampilkan `country` dan jumlah pelanggan (`COUNT(*)`) dari tabel `customers` yang dikelompokkan berdasarkan `country`, tetapi hanya tampilkan negara yang memiliki **lebih dari 1 pelanggan** (`HAVING COUNT(*) > 1`).',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi', 'Indonesia'), (2, 'Siti', 'Indonesia'), (3, 'John', 'Malaysia'), (4, 'Dewi', 'Indonesia');`,
    expected_sql: 'SELECT country, COUNT(*) FROM customers GROUP BY country HAVING COUNT(*) > 1;',
    initial_code: '-- Tulis query dengan klausul HAVING di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 27,
    slug: 'sql-exists-operator',
    title: 'Pengujian Subquery dengan EXISTS',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 27,
    theory_markdown: `# Operator EXISTS

Operator **EXISTS** digunakan untuk menguji keberadaan record dalam subquery. Mengembalikan nilai TRUE jika subquery mengembalikan satu atau lebih record.

### Sintaksis:
\`\`\`sql
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);
\`\`\``,
    instructions_markdown: 'Tampilkan nama pemasok (`suppliers.name`) dari tabel `suppliers` jika terdapat produk di tabel `products` yang dipasok oleh pemasok tersebut (`WHERE EXISTS (SELECT * FROM products WHERE products.supplier_id = suppliers.id)`).',
    seed_sql: `CREATE TABLE suppliers (id INT, name TEXT);
CREATE TABLE products (id INT, supplier_id INT, name TEXT);
INSERT INTO suppliers VALUES (1, 'PT Maju Jaya'), (2, 'CV Abadi'), (3, 'UD Makmur');
INSERT INTO products VALUES (101, 1, 'Laptop'), (102, 1, 'Mouse');`,
    expected_sql: 'SELECT name FROM suppliers WHERE EXISTS (SELECT * FROM products WHERE products.supplier_id = suppliers.id);',
    initial_code: '-- Tulis query dengan EXISTS di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 28,
    slug: 'sql-any-all-operators',
    title: 'Subquery dengan ANY dan ALL',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 28,
    theory_markdown: `# Operator Subquery IN / ANY / ALL

Subquery dapat digunakan untuk membandingkan nilai kolom dengan sekumpulan nilai dari tabel lain.

Contoh mencari nilai produk yang harganya lebih besar dari rata-rata atau ada di dalam daftar subquery.`,
    instructions_markdown: 'Tampilkan seluruh `name` dan `price` dari tabel `products` yang harganya lebih besar dari harga rata-rata produk (`WHERE price > (SELECT AVG(price) FROM products)`).',
    seed_sql: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'Mouse', 100000), (2, 'Keyboard', 300000), (3, 'Monitor', 2000000), (4, 'Headset', 400000);`,
    expected_sql: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);',
    initial_code: '-- Tulis query Subquery di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 29,
    slug: 'sql-insert-into-select',
    title: 'Menyalin Data antar Tabel dengan INSERT INTO SELECT',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 29,
    theory_markdown: `# INSERT INTO SELECT

Pernyataan **INSERT INTO SELECT** Menyalin data dari satu tabel dan memasukkannya ke dalam tabel lain yang sudah ada.

### Sintaksis:
\`\`\`sql
INSERT INTO table2 (column1, column2, ...)
SELECT column1, column2, ...
FROM table1
WHERE condition;
\`\`\``,
    instructions_markdown: "Salin seluruh data `name` dan `city` dari tabel `customers` yang kotanya adalah **'Jakarta'** ke dalam tabel `archived_customers (name, city)`. Setelah itu, tampilkan isi `archived_customers` dengan `SELECT * FROM archived_customers;`.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT);
CREATE TABLE archived_customers (name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Budi', 'Jakarta'), (2, 'Siti', 'Bandung'), (3, 'Andi', 'Jakarta');`,
    expected_sql: "INSERT INTO archived_customers (name, city) SELECT name, city FROM customers WHERE city = 'Jakarta'; SELECT * FROM archived_customers;",
    initial_code: '-- Tulis perintah INSERT INTO SELECT dan SELECT * FROM archived_customers di bawah ini:\n',
    evaluator_type: 'data_match',
  },
  {
    id: 30,
    slug: 'sql-case-expression',
    title: 'Logika Kondisional dengan CASE WHEN',
    category: 'Level 4: SQL Grouping & Subqueries',
    path_id: 'grouping',
    order_index: 30,
    theory_markdown: `# Ekspresi CASE WHEN

Ekspresi **CASE** melewati kondisi dan mengembalikan nilai ketika kondisi pertama dipenuhi (seperti pernyataan IF-THEN-ELSE).

### Sintaksis:
\`\`\`sql
SELECT column_name,
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE result3
END AS alias_name
FROM table_name;
\`\`\``,
    instructions_markdown: "Tampilkan `name`, `score`, dan kolom baru bernama **'status'** yang bernilai **'Lulus'** jika `score >= 70` dan **'Remidi'** jika sebaliknya dari tabel `students`.",
    seed_sql: `CREATE TABLE students (id INT, name TEXT, score INT);
INSERT INTO students VALUES (1, 'Budi', 85), (2, 'Siti', 65), (3, 'Andi', 70);`,
    expected_sql: "SELECT name, score, CASE WHEN score >= 70 THEN 'Lulus' ELSE 'Remidi' END AS status FROM students;",
    initial_code: '-- Tulis query ekspresi CASE WHEN di bawah ini:\n',
    evaluator_type: 'data_match',
  },

  // PATH 5: SQL DDL, CONSTRAINTS & SECURITY (31 - 40)
  {
    id: 31,
    slug: 'sql-create-table',
    title: 'Membuat Tabel Baru dengan CREATE TABLE',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 31,
    theory_markdown: `# Perintah CREATE TABLE

Pernyataan **CREATE TABLE** digunakan untuk membuat tabel baru dalam database.

### Sintaksis:
\`\`\`sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype
);
\`\`\``,
    instructions_markdown: 'Buat tabel baru bernama **`employees`** dengan kolom-kolom berikut:\n- `id` bertipe `INT`\n- `name` bertipe `TEXT`\n- `position` bertipe `TEXT`\n- `salary` bertipe `INT`',
    seed_sql: '',
    expected_sql: 'CREATE TABLE employees (id INT, name TEXT, position TEXT, salary INT);',
    initial_code: '-- Tulis perintah CREATE TABLE employees di bawah ini:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 32,
    slug: 'sql-alter-table',
    title: 'Mengubah Struktur Tabel dengan ALTER TABLE',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 32,
    theory_markdown: `# Perintah ALTER TABLE

Pernyataan **ALTER TABLE** digunakan untuk menambah, menghapus, atau mengubah kolom dalam tabel yang sudah ada.

### Sintaksis:
\`\`\`sql
ALTER TABLE table_name ADD column_name datatype;
\`\`\``,
    instructions_markdown: 'Tambahkan kolom baru bernama **`email`** bertipe `TEXT` ke dalam tabel `users` yang sudah ada.',
    seed_sql: 'CREATE TABLE users (id INT, username TEXT);',
    expected_sql: 'ALTER TABLE users ADD COLUMN email TEXT;',
    initial_code: '-- Tulis perintah ALTER TABLE di bawah ini:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 33,
    slug: 'sql-drop-table',
    title: 'Menghapus Tabel dengan DROP TABLE',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 33,
    theory_markdown: `# Perintah DROP TABLE

Pernyataan **DROP TABLE** digunakan untuk menghapus tabel yang ada dalam database beserta seluruh datanya.

### Sintaksis:
\`\`\`sql
DROP TABLE table_name;
\`\`\``,
    instructions_markdown: 'Hapus tabel sementara bernama **`temp_logs`** dari database.',
    seed_sql: "CREATE TABLE temp_logs (id INT, log_message TEXT); INSERT INTO temp_logs VALUES (1, 'test');",
    expected_sql: 'DROP TABLE temp_logs;',
    initial_code: '-- Tulis perintah DROP TABLE di bawah ini:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 34,
    slug: 'sql-not-null-constraint',
    title: 'Batasan Wajib Isi dengan NOT NULL',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 34,
    theory_markdown: `# Constraint NOT NULL

Batasan **NOT NULL** memastikan bahwa suatu kolom tidak boleh menerima nilai NULL.

### Sintaksis:
\`\`\`sql
CREATE TABLE table_name (
    id INT NOT NULL,
    name TEXT NOT NULL
);
\`\`\``,
    instructions_markdown: 'Buat tabel **`categories`** dengan kolom `id INT NOT NULL` dan `category_name TEXT NOT NULL`.',
    seed_sql: '',
    expected_sql: 'CREATE TABLE categories (id INT NOT NULL, category_name TEXT NOT NULL);',
    initial_code: '-- Buat tabel categories dengan constraint NOT NULL:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 35,
    slug: 'sql-unique-constraint',
    title: 'Batasan Nilai Unik dengan UNIQUE',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 35,
    theory_markdown: `# Constraint UNIQUE

Batasan **UNIQUE** memastikan bahwa seluruh nilai dalam satu kolom berbeda satu sama lain (unik).

### Sintaksis:
\`\`\`sql
CREATE TABLE table_name (
    id INT NOT NULL,
    email TEXT UNIQUE
);
\`\`\``,
    instructions_markdown: 'Buat tabel **`members`** dengan kolom `id INT` dan kolom `email TEXT UNIQUE`.',
    seed_sql: '',
    expected_sql: 'CREATE TABLE members (id INT, email TEXT UNIQUE);',
    initial_code: '-- Buat tabel members dengan constraint UNIQUE:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 36,
    slug: 'sql-primary-key',
    title: 'Kunci Utama Tabel dengan PRIMARY KEY',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 36,
    theory_markdown: `# Constraint PRIMARY KEY

Batasan **PRIMARY KEY** secara unik mengidentifikasi setiap record dalam tabel. Primary key harus berisi nilai UNIK dan tidak boleh bernilai NULL.

### Sintaksis:
\`\`\`sql
CREATE TABLE table_name (
    id INT PRIMARY KEY,
    name TEXT
);
\`\`\``,
    instructions_markdown: 'Buat tabel **`student_accounts`** dengan kolom `student_id INT PRIMARY KEY` dan `username TEXT`.',
    seed_sql: '',
    expected_sql: 'CREATE TABLE student_accounts (student_id INT PRIMARY KEY, username TEXT);',
    initial_code: '-- Buat tabel student_accounts dengan PRIMARY KEY:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 37,
    slug: 'sql-foreign-key',
    title: 'Kunci Relasi antar Tabel dengan FOREIGN KEY',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 37,
    theory_markdown: `# Constraint FOREIGN KEY

Batasan **FOREIGN KEY** digunakan untuk mencegah tindakan yang akan merusak hubungan antar tabel.

Foreign Key mereferensikan Primary Key di tabel lain.

### Sintaksis:
\`\`\`sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT REFERENCES users(id)
);
\`\`\``,
    instructions_markdown: 'Buat tabel **`orders`** dengan kolom `id INT PRIMARY KEY`, `user_id INT REFERENCES users(id)`, dan `total_price INT`.',
    seed_sql: 'CREATE TABLE users (id INT PRIMARY KEY, name TEXT);',
    expected_sql: 'CREATE TABLE orders (id INT PRIMARY KEY, user_id INT REFERENCES users(id), total_price INT);',
    initial_code: '-- Buat tabel orders dengan FOREIGN KEY ke users(id):\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 38,
    slug: 'sql-default-constraint',
    title: 'Nilai Bawaan dengan DEFAULT',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 38,
    theory_markdown: `# Constraint DEFAULT

Batasan **DEFAULT** digunakan untuk menetapkan nilai bawaan untuk sebuah kolom jika tidak ada nilai yang ditentukan saat menyisipkan data.

### Sintaksis:
\`\`\`sql
CREATE TABLE table_name (
    id INT,
    status TEXT DEFAULT 'active'
);
\`\`\``,
    instructions_markdown: "Buat tabel **`tasks`** dengan kolom `id INT`, `title TEXT`, dan `status TEXT DEFAULT 'pending'`.",
    seed_sql: '',
    expected_sql: "CREATE TABLE tasks (id INT, title TEXT, status TEXT DEFAULT 'pending');",
    initial_code: '-- Buat tabel tasks dengan nilai DEFAULT:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 39,
    slug: 'sql-create-view',
    title: 'Membuat View Database dengan CREATE VIEW',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 39,
    theory_markdown: `# Perintah CREATE VIEW

Dalam SQL, **VIEW** adalah tabel virtual berdasarkan hasil dari pernyataan SELECT.

### Sintaksis:
\`\`\`sql
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
\`\`\``,
    instructions_markdown: "Buat VIEW bernama **`active_customers`** yang mengambil seluruh kolom dari tabel `customers` di mana `status = 'active'`.",
    seed_sql: "CREATE TABLE customers (id INT, name TEXT, status TEXT); INSERT INTO customers VALUES (1, 'Budi', 'active'), (2, 'Siti', 'inactive');",
    expected_sql: "CREATE VIEW active_customers AS SELECT * FROM customers WHERE status = 'active';",
    initial_code: '-- Tulis perintah CREATE VIEW di bawah ini:\n',
    evaluator_type: 'schema_match',
  },
  {
    id: 40,
    slug: 'sql-injection-security',
    title: 'Simulasi & Pencegahan Bahaya SQL Injection',
    category: 'Level 5: SQL DDL, Constraints & Security',
    path_id: 'ddl_security',
    order_index: 40,
    theory_markdown: `# Bahaya SQL Injection & Keamanan Database

**SQL Injection (SQLi)** terjadi ketika input pengguna yang jahat disisipkan langsung ke dalam query SQL tanpa validasi atau pembatasan (parameterization).

### Contoh Celah SQLi:
Jika query dibentuk dengan string concatenation:
\`"SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passInput + "'"\`

Jika attacker memasukkan input: \`' OR '1'='1\`, query menjadi:
\`SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'\`

Sehingga kondisi selalu bernilai **TRUE** dan meretas autentikasi!

### Pencegahan:
Selalu gunakan **Parameterized Queries** (Prepared Statements) di backend aplikasi!`,
    instructions_markdown: "Jalankan simulasi serangan SQL Injection pada tabel `users` dengan menuliskan query yang mengambil seluruh pengguna terlepas dari password menggunakan kondisi **`WHERE username = 'admin' OR '1'='1'`**.",
    seed_sql: "CREATE TABLE users (id INT, username TEXT, password TEXT); INSERT INTO users VALUES (1, 'admin', 'supersecret123'), (2, 'budi', 'userpass456');",
    expected_sql: "SELECT * FROM users WHERE username = 'admin' OR '1'='1';",
    initial_code: '-- Tulis query simulasi SQL Injection di bawah ini:\n',
    evaluator_type: 'data_match',
  },
];

export const initialSqlLessons = seedLessons;
