export interface SQLLesson {
  id: number;
  slug: string;
  title: string;
  category: string;
  order_index: number;
  theory_markdown: string;
  instructions_markdown: string;
  seed_sql: string;
  expected_sql: string;
  initial_code: string;
}

export const seedLessons: SQLLesson[] = [
  {
    id: 1,
    slug: 'sql-select-all',
    title: 'Pengenalan Perintah SELECT',
    category: 'W3Schools SQL Fundamentals',
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
    initial_code: '-- Tulis query SQL Anda di bawah ini:\nSELECT * FROM customers;',
  },
  {
    id: 2,
    slug: 'sql-where-clause',
    title: 'Filter Data Menggunakan WHERE',
    category: 'W3Schools SQL Fundamentals',
    order_index: 2,
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
- \`<>\` : Tidak sama dengan (Pada beberapa versi SQL dapat ditulis \`!=\`)

### Contoh String/Teks:
Nilai teks dalam SQL harus diapit oleh tanda petik tunggal, contoh: \`WHERE city = 'Bandung'\`.`,
    instructions_markdown: "Tulis query SQL untuk menampilkan seluruh data pelanggan dari tabel `customers` yang berdomisili di kota **'Bandung'**.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "SELECT * FROM customers WHERE city = 'Bandung';",
    initial_code: "-- Tulis query SQL dengan klausul WHERE di bawah ini:\nSELECT * FROM customers WHERE city = 'Bandung';",
  },
  {
    id: 3,
    slug: 'sql-order-by',
    title: 'Mengurutkan Data dengan ORDER BY',
    category: 'W3Schools SQL Fundamentals',
    order_index: 3,
    theory_markdown: `# Perintah ORDER BY

Kata kunci **ORDER BY** digunakan untuk mengurutkan hasil query secara ascending (menaik) atau descending (menurun).

Secara default, kata kunci \`ORDER BY\` mengurutkan record secara **ascending (ASC)**. Untuk mengurutkan record secara descending, gunakan kata kunci **DESC**.

### Sintaksis:
\`\`\`sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC|DESC;
\`\`\`

### Contoh:
- Mengurutkan secara menaik berdasarkan nama:
  \`\`\`sql
  SELECT * FROM customers ORDER BY name ASC;
  \`\`\`
- Mengurutkan secara menurun berdasarkan id:
  \`\`\`sql
  SELECT * FROM customers ORDER BY id DESC;
  \`\`\``,
    instructions_markdown: 'Tampilkan seluruh data pelanggan dari tabel `customers` diurutkan berdasarkan **name** secara alfabetis naik (**ASC**).',
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Ahmad Dahlan', 'Yogyakarta', 'Indonesia');
INSERT INTO customers VALUES (3, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (4, 'Citra Dewi', 'Surabaya', 'Indonesia');`,
    expected_sql: 'SELECT * FROM customers ORDER BY name ASC;',
    initial_code: '-- Tulis query SQL dengan ORDER BY di bawah ini:\nSELECT * FROM customers ORDER BY name ASC;',
  },
  {
    id: 4,
    slug: 'sql-insert-into',
    title: 'Menambahkan Data Baru dengan INSERT INTO',
    category: 'W3Schools SQL Fundamentals',
    order_index: 4,
    theory_markdown: `# Perintah INSERT INTO

Perintah **INSERT INTO** digunakan untuk menyisipkan/menambahkan record baru ke dalam tabel.

### Terdapat Dua Cara Penulisan INSERT INTO:

1. **Menentukan nama kolom dan nilai yang akan dimasukkan:**
\`\`\`sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
\`\`\`

2. **Jika menambahkan nilai untuk seluruh kolom tabel (sesuai urutan kolom):**
\`\`\`sql
INSERT INTO table_name
VALUES (value1, value2, value3, ...);
\`\`\`

### Contoh:
\`\`\`sql
INSERT INTO customers (id, name, city, country)
VALUES (5, 'Eko Prasetyo', 'Semarang', 'Indonesia');
\`\`\``,
    instructions_markdown: "Tambahkan pelanggan baru ke tabel `customers` dengan rincian data berikut:\n- `id`: 5\n- `name`: `'Eko Prasetyo'`\n- `city`: `'Semarang'`\n- `country`: `'Indonesia'`\n\nSetelah baris `INSERT INTO`, tuliskan perintah `SELECT * FROM customers;` di baris berikutnya agar perubahan tabel dapat ditampilkan.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "INSERT INTO customers (id, name, city, country) VALUES (5, 'Eko Prasetyo', 'Semarang', 'Indonesia'); SELECT * FROM customers;",
    initial_code: "-- Tambahkan data baru lalu tampilkan dengan SELECT * FROM customers;\nINSERT INTO customers (id, name, city, country) VALUES (5, 'Eko Prasetyo', 'Semarang', 'Indonesia');\nSELECT * FROM customers;",
  },
  {
    id: 5,
    slug: 'sql-update-data',
    title: 'Memperbarui Data dengan UPDATE',
    category: 'W3Schools SQL Fundamentals',
    order_index: 5,
    theory_markdown: `# Perintah UPDATE

Perintah **UPDATE** digunakan untuk mengubah/memperbarui record yang sudah ada dalam tabel.

### Sintaksis:
\`\`\`sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
\`\`\`

> **PERATURAN PENTING:**
> Hati-hati saat memperbarui record dalam tabel! Perhatikan klausul \`WHERE\` dalam perintah \`UPDATE\`. Klausul \`WHERE\` menentukan record mana yang harus diperbarui. Jika Anda menghilangkan klausul \`WHERE\`, **SEMUA record dalam tabel akan diperbarui!**

### Contoh:
\`\`\`sql
UPDATE customers
SET city = 'Surakarta'
WHERE id = 1;
\`\`\``,
    instructions_markdown: "Perbarui (UPDATE) data pelanggan pada tabel `customers` yang memiliki `id = 3` sehingga kolom `city` berubah menjadi **'Bali'**. Setelah perintah `UPDATE`, tambahkan `SELECT * FROM customers;` di baris berikutnya untuk menampilkan tabel hasil.",
    seed_sql: `CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
INSERT INTO customers VALUES (4, 'Dewi Lestari', 'Bandung', 'Indonesia');`,
    expected_sql: "UPDATE customers SET city = 'Bali' WHERE id = 3; SELECT * FROM customers;",
    initial_code: "-- Tulis perintah UPDATE dan SELECT * FROM customers;\nUPDATE customers SET city = 'Bali' WHERE id = 3;\nSELECT * FROM customers;",
  },
];

export const initialSqlLessons = seedLessons;
