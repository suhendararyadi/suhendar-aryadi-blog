# Interactive SQL Learning Platform (FreeCodeCamp Style) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun platform pembelajaran coding SQL interaktif bergaya FreeCodeCamp pada blog Astro Suhendar Aryadi dengan sistem autentikasi siswa, editor CodeMirror, evaluasi otomatis, materi W3Schools, dan database Vercel Postgres.

**Architecture:** Mengkonfigurasi Astro ke SSR Mode (`output: 'server'`) menggunakan `@astrojs/vercel`. Membuat skema database Postgres untuk users, sessions, sql_lessons, dan user_progress, menyusun backend API evaluator SQL, serta membangun UI split-screen interaktif (CodeMirror 6 + Result Table).

**Tech Stack:** Astro v4 (SSR), `@astrojs/vercel`, `@vercel/postgres` / `sql.js`, `bcryptjs`, `@codemirror/lang-sql`, `typescript`.

## Global Constraints
- **Framework Mode**: Astro v4 SSR Mode (`output: 'server'`, `@astrojs/vercel`)
- **Database**: Vercel Postgres / SQL Schema
- **Styling**: Glassmorphism CSS System (`global.css`)
- **Interactive Editor**: CodeMirror 6 Client Component

---

### Task 1: Setup Astro SSR Mode & Dependencies

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: Node environment
- Produces: Astro SSR enabled with `@astrojs/vercel`, `bcryptjs`, `@codemirror/lang-sql`, `sql.js`

- [ ] **Step 1: Install SSR & SQL Platform Dependencies**

Run: `npm install @astrojs/vercel @vercel/postgres bcryptjs sql.js @codemirror/lang-sql @codemirror/view @codemirror/state`
Run: `npm install -D @types/bcryptjs @types/sql.js`

- [ ] **Step 2: Update `astro.config.mjs` to SSR Mode**

Tulis `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://suhendararyadi.dev',
  output: 'server',
  adapter: vercel(),
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
```

- [ ] **Step 3: Verifikasi Astro build dalam SSR mode**

Run: `npx astro check`
Run: `npm run build`
Expected: Build sukses tanpa error dengan SSR output.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: enable Astro SSR mode with vercel adapter and SQL dependencies"
```

---

### Task 2: Database Client & Migration Schema (`src/lib/db.ts`)

**Files:**
- Create: `src/lib/db.ts`
- Create: `scripts/migrate.js`

**Interfaces:**
- Consumes: Environment variables / Vercel Postgres connection
- Produces: Postgres client helper and schema migration script

- [ ] **Step 1: Buat `src/lib/db.ts`**

Tulis `src/lib/db.ts`:
```typescript
import { createPool } from '@vercel/postgres';

export const db = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
});

export async function query(text: string, params?: any[]) {
  const client = await db.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
```

- [ ] **Step 2: Buat migration script `scripts/migrate.js`**

Tulis `scripts/migrate.js`:
```javascript
import { createPool } from '@vercel/postgres';

const db = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
});

async function migrate() {
  console.log('Running SQL Platform migrations...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sql_lessons (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(100) NOT NULL,
      order_index INT NOT NULL,
      theory_markdown TEXT NOT NULL,
      instructions_markdown TEXT NOT NULL,
      seed_sql TEXT NOT NULL,
      expected_sql TEXT NOT NULL,
      initial_code TEXT DEFAULT 'SELECT * FROM customers;'
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INT REFERENCES sql_lessons(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'completed',
      submitted_code TEXT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id)
    );
  `);
  console.log('Migrations completed successfully!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts scripts/migrate.js
git commit -m "feat: add db client helper and SQL platform migration script"
```

---

### Task 3: Authentication System (`src/lib/auth.ts` & Auth APIs)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/pages/api/auth/register.ts`
- Create: `src/pages/api/auth/login.ts`
- Create: `src/pages/api/auth/logout.ts`
- Create: `src/pages/auth/register.astro`
- Create: `src/pages/auth/login.astro`

**Interfaces:**
- Consumes: `users` dan `sessions` DB tables, `bcryptjs`
- Produces: Registration, login, logout, & session verification helpers

- [ ] **Step 1: Buat `src/lib/auth.ts`**

Tulis `src/lib/auth.ts`:
```typescript
import bcrypt from 'bcryptjs';
import { query } from './db';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  await query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  );
  return sessionId;
}

export async function getSessionUser(sessionId?: string) {
  if (!sessionId) return null;
  
  const res = await query(
    `SELECT u.id, u.name, u.email, u.role 
     FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  );
  return res.rows[0] || null;
}

export async function destroySession(sessionId: string) {
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}
```

- [ ] **Step 2: Buat API Auth Endpoints (`register.ts`, `login.ts`, `logout.ts`)**

Tulis `src/pages/api/auth/register.ts`:
```typescript
import type { APIRoute } from 'astro';
import { hashPassword, createSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Nama, Email, dan Password wajib diisi.' }), { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Email sudah terdaftar.' }), { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const res = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, email, passwordHash]
    );
    const userId = res.rows[0].id;
    const sessionId = await createSession(userId);

    cookies.set('session_id', sessionId, { path: '/', httpOnly: true, secure: true });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
```

Tulis `src/pages/api/auth/login.ts`:
```typescript
import type { APIRoute } from 'astro';
import { verifyPassword, createSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();
    const res = await query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Email atau password salah.' }), { status: 400 });
    }

    const user = res.rows[0];
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Email atau password salah.' }), { status: 400 });
    }

    const sessionId = await createSession(user.id);
    cookies.set('session_id', sessionId, { path: '/', httpOnly: true, secure: true });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
```

Tulis `src/pages/api/auth/logout.ts`:
```typescript
import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('session_id')?.value;
  if (sessionId) {
    await destroySession(sessionId);
    cookies.delete('session_id', { path: '/' });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
```

- [ ] **Step 3: Buat Halaman UI Register & Login (`/auth/register.astro`, `/auth/login.astro`)**

Tulis `src/pages/auth/register.astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
---
<MainLayout title="Daftar Akun Siswa RPL | Suhendar Aryadi">
  <div class="glass-card auth-card">
    <h2>Registrasi Akun Siswa RPL</h2>
    <p class="subtitle">Buat akun untuk menyimpan progres belajar & sertifikat latihan SQL Anda.</p>
    <div id="error-msg" class="error-banner" style="display:none;"></div>
    <form id="register-form">
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input type="text" id="name" required class="input-field" placeholder="cth: Budi Santoso" />
      </div>
      <div class="form-group">
        <label for="email">Email / NISN</label>
        <input type="email" id="email" required class="input-field" placeholder="siswa@smk.sch.id" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" required class="input-field" placeholder="******" />
      </div>
      <button type="submit" class="btn btn-primary width-full">Daftar Sekarang</button>
    </form>
    <p class="auth-footer">Sudah punya akun? <a href="/auth/login">Login di sini</a></p>
  </div>
</MainLayout>

<script>
  const form = document.getElementById('register-form');
  const errorMsg = document.getElementById('error-msg');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/belajar/sql';
    } else {
      if (errorMsg) {
        errorMsg.innerText = data.error || 'Gagal mendaftar.';
        errorMsg.style.display = 'block';
      }
    }
  });
</script>

<style>
  .auth-card { max-width: 450px; margin: 3rem auto; padding: 2.5rem; }
  .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-primary); }
  .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: var(--glass-border); background: var(--bg-secondary); color: var(--text-primary); }
  .width-full { width: 100%; justify-content: center; margin-top: 1rem; }
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
  .error-banner { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.9rem; }
</style>
```

Tulis `src/pages/auth/login.astro`:
```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
---
<MainLayout title="Login Siswa RPL | Suhendar Aryadi">
  <div class="glass-card auth-card">
    <h2>Login Akun Siswa</h2>
    <p class="subtitle">Masuk untuk melanjutkan tantangan coding SQL Anda.</p>
    <div id="error-msg" class="error-banner" style="display:none;"></div>
    <form id="login-form">
      <div class="form-group">
        <label for="email">Email / NISN</label>
        <input type="email" id="email" required class="input-field" placeholder="siswa@smk.sch.id" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" required class="input-field" placeholder="******" />
      </div>
      <button type="submit" class="btn btn-primary width-full">Login</button>
    </form>
    <p class="auth-footer">Belum punya akun? <a href="/auth/register">Daftar di sini</a></p>
  </div>
</MainLayout>

<script>
  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/belajar/sql';
    } else {
      if (errorMsg) {
        errorMsg.innerText = data.error || 'Login gagal.';
        errorMsg.style.display = 'block';
      }
    }
  });
</script>

<style>
  .auth-card { max-width: 450px; margin: 3rem auto; padding: 2.5rem; }
  .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-primary); }
  .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: var(--glass-border); background: var(--bg-secondary); color: var(--text-primary); }
  .width-full { width: 100%; justify-content: center; margin-top: 1rem; }
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
  .error-banner { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.9rem; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/pages/api/auth/ src/pages/auth/
git commit -m "feat: implement authentication system (register, login, logout, session cookies)"
```

---

### Task 4: Interactive SQL Evaluator Backend (`src/lib/sqlEvaluator.ts` & API)

**Files:**
- Create: `src/lib/sqlEvaluator.ts`
- Create: `src/pages/api/sql/execute.ts`
- Create: `src/pages/api/sql/evaluate.ts`

**Interfaces:**
- Consumes: `sql.js` WASM / in-memory SQLite sandbox
- Produces: Query execution results and solution validation logic

- [ ] **Step 1: Buat `src/lib/sqlEvaluator.ts`**

Tulis `src/lib/sqlEvaluator.ts`:
```typescript
import initSqlJs from 'sql.js';

let SQL: any = null;

async function getSQL() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

export interface SQLExecutionResult {
  columns: string[];
  values: any[][];
  error?: string;
}

export async function runQuery(seedSql: string, userSql: string): Promise<SQLExecutionResult> {
  try {
    const SqlEngine = await getSQL();
    const db = new SqlEngine.Database();
    
    // Seed sample tables
    db.run(seedSql);
    
    // Run user query
    const res = db.exec(userSql);
    if (!res || res.length === 0) {
      return { columns: [], values: [] };
    }
    
    return {
      columns: res[0].columns,
      values: res[0].values
    };
  } catch (err: any) {
    return { columns: [], values: [], error: err.message };
  }
}

export async function evaluateSolution(seedSql: string, expectedSql: string, userSql: string) {
  const expectedRes = await runQuery(seedSql, expectedSql);
  const userRes = await runQuery(seedSql, userSql);

  if (userRes.error) {
    return { passed: false, error: `SQL Error: ${userRes.error}`, userResult: userRes };
  }

  // Compare columns and rows
  const colMatch = JSON.stringify(expectedRes.columns) === JSON.stringify(userRes.columns);
  const valMatch = JSON.stringify(expectedRes.values) === JSON.stringify(userRes.values);

  if (colMatch && valMatch) {
    return { passed: true, message: '✅ Jawaban Benar! Selamat, solusi Anda tepat.', userResult: userRes };
  }

  return { 
    passed: false, 
    error: '❌ Hasil query belum sesuai dengan instruksi yang diminta.', 
    userResult: userRes,
    expectedResult: expectedRes 
  };
}
```

- [ ] **Step 2: Buat API Endpoints (`execute.ts` & `evaluate.ts`)**

Tulis `src/pages/api/sql/execute.ts`:
```typescript
import type { APIRoute } from 'astro';
import { runQuery } from '../../../lib/sqlEvaluator';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { seedSql, userSql } = await request.json();
    const result = await runQuery(seedSql || '', userSql || '');
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
```

Tulis `src/pages/api/sql/evaluate.ts`:
```typescript
import type { APIRoute } from 'astro';
import { evaluateSolution } from '../../../lib/sqlEvaluator';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    const { lessonId, seedSql, expectedSql, userSql } = await request.json();
    const evalResult = await evaluateSolution(seedSql, expectedSql, userSql);

    if (evalResult.passed && user && lessonId) {
      // Save progress to database
      await query(
        `INSERT INTO user_progress (user_id, lesson_id, status, submitted_code)
         VALUES ($1, $2, 'completed', $3)
         ON CONFLICT (user_id, lesson_id) 
         DO UPDATE SET submitted_code = EXCLUDED.submitted_code, completed_at = NOW()`,
        [user.id, lessonId, userSql]
      );
    }

    return new Response(JSON.stringify(evalResult), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/sqlEvaluator.ts src/pages/api/sql/
git commit -m "feat: add interactive SQL execution and evaluation API"
```

---

### Task 5: W3Schools SQL Course Seed Data (`src/lib/seedLessons.ts`)

**Files:**
- Create: `src/lib/seedLessons.ts`

**Interfaces:**
- Consumes: W3Schools SQL Fundamentals Curriculum
- Produces: Pre-populated SQL lessons for `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`

- [ ] **Step 1: Buat `src/lib/seedLessons.ts`**

Tulis `src/lib/seedLessons.ts`:
```typescript
export const initialSqlLessons = [
  {
    slug: "sql-select-all",
    title: "1. Pengenalan Perintah SELECT",
    category: "SQL Basic Query",
    order_index: 1,
    theory_markdown: `Perintah **SELECT** digunakan untuk mengambil data dari tabel database SQL.\n\n### Sintaksis:\n\`\`\`sql\nSELECT column1, column2 FROM table_name;\n\`\`\`\n\nJika Anda ingin menampilkan **seluruh kolom**, gunakan tanda bintang (\`*\`):\n\`\`\`sql\nSELECT * FROM table_name;\n\`\`\``,
    instructions_markdown: "Tulis query SQL untuk menampilkan **seluruh kolom dan baris** dari tabel `customers`.",
    seed_sql: `
      CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
      INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
      INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
      INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
    `,
    expected_sql: "SELECT * FROM customers;",
    initial_code: "-- Tulis query SQL di bawah ini:\nSELECT * FROM customers;"
  },
  {
    slug: "sql-where-clause",
    title: "2. Filter Data Menggunakan WHERE",
    category: "SQL Basic Query",
    order_index: 2,
    theory_markdown: `Klausul **WHERE** digunakan untuk memfilter record data yang hanya memenuhi kondisi tertentu.\n\n### Sintaksis:\n\`\`\`sql\nSELECT * FROM table_name WHERE condition;\n\`\`\``,
    instructions_markdown: "Tampilkan seluruh data pelanggan dari tabel `customers` yang berdomisili di kota **'Bandung'**.",
    seed_sql: `
      CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
      INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
      INSERT INTO customers VALUES (2, 'Siti Rahma', 'Bandung', 'Indonesia');
      INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
    `,
    expected_sql: "SELECT * FROM customers WHERE city = 'Bandung';",
    initial_code: "SELECT * FROM customers WHERE city = 'Bandung';"
  },
  {
    slug: "sql-order-by",
    title: "3. Mengurutkan Data dengan ORDER BY",
    category: "SQL Basic Query",
    order_index: 3,
    theory_markdown: `Perintah **ORDER BY** digunakan untuk mengurutkan hasil query secara naik (\`ASC\`) atau turun (\`DESC\`).`,
    instructions_markdown: "Tampilkan seluruh data pelanggan dari tabel `customers` diurutkan berdasarkan nama secara alfabetis (**ASC**).",
    seed_sql: `
      CREATE TABLE customers (id INT, name TEXT, city TEXT, country TEXT);
      INSERT INTO customers VALUES (1, 'Budi Santoso', 'Jakarta', 'Indonesia');
      INSERT INTO customers VALUES (2, 'Ahmad Dahlan', 'Yogyakarta', 'Indonesia');
      INSERT INTO customers VALUES (3, 'John Doe', 'Surabaya', 'Indonesia');
    `,
    expected_sql: "SELECT * FROM customers ORDER BY name ASC;",
    initial_code: "SELECT * FROM customers ORDER BY name ASC;"
  }
];
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/seedLessons.ts
git commit -m "feat: add initial W3Schools SQL course seed data"
```

---

### Task 6: Interactive Workspace & Catalog Pages (`/belajar/sql/`)

**Files:**
- Create: `src/pages/belajar/sql/index.astro`
- Create: `src/pages/belajar/sql/[slug].astro`
- Create: `src/pages/dashboard.astro`

**Interfaces:**
- Consumes: `getSessionUser()`, `sql_lessons`, `user_progress`
- Produces: FreeCodeCamp-style interactive split-screen workspace, catalog page, and user progress dashboard

- [ ] **Step 1: Buat Halaman Katalog Latihan SQL (`src/pages/belajar/sql/index.astro`)**

Tulis `src/pages/belajar/sql/index.astro`:
```astro
---
import MainLayout from '../../../layouts/MainLayout.astro';
import { getSessionUser } from '../../../lib/auth';
import { initialSqlLessons } from '../../../lib/seedLessons';

const sessionId = Astro.cookies.get('session_id')?.value;
const user = await getSessionUser(sessionId);
---
<MainLayout title="Modul Pembelajaran SQL Interaktif | Suhendar Aryadi">
  <div class="header-banner glass-card">
    <span class="badge">Interactive Coding Curriculum</span>
    <h1>Platform Belajar SQL Interaktif</h1>
    <p class="subtitle">
      Pelajari sintaksis SQL standar industri secara praktis langsung di browser Anda. Selesaikan tantangan dan kumpulkan badge kelulusan!
    </p>
    {user ? (
      <div class="user-pill">
        <span>👤 Selamat Belajar, <strong>{user.name}</strong></span>
        <a href="/dashboard" class="btn btn-secondary btn-sm">Lihat Dashboard Progres</a>
      </div>
    ) : (
      <div class="auth-notice">
        <span>⚠️ Login terlebih dahulu untuk menyimpan progres latihan Anda ke database.</span>
        <a href="/auth/login" class="btn btn-primary btn-sm">Login Siswa</a>
      </div>
    )}
  </div>

  <section class="section" style="margin-top: 2rem;">
    <h2>📚 Daftar Kurikulum SQL Fundamentals</h2>
    <div class="lesson-list grid">
      {initialSqlLessons.map(lesson => (
        <a href={`/belajar/sql/${lesson.slug}`} class="glass-card card-link">
          <div class="card-header">
            <span class="badge">{lesson.category}</span>
            <span class="lesson-num">Modul #{lesson.order_index}</span>
          </div>
          <h3>{lesson.title}</h3>
          <p class="cta-text">Mulai Latihan Coding ➔</p>
        </a>
      ))}
    </div>
  </section>
</MainLayout>

<style>
  .header-banner { padding: 2.5rem; }
  .subtitle { color: var(--text-secondary); margin: 0.75rem 0 1.5rem; max-width: 700px; }
  .user-pill, .auth-notice { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: var(--bg-secondary); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: var(--glass-border); }
  .btn-sm { padding: 0.4rem 0.9rem; font-size: 0.85rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .lesson-num { font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); }
  .card-link h3 { color: var(--text-primary); margin-bottom: 1rem; font-size: 1.15rem; }
  .cta-text { color: var(--accent-primary); font-weight: 600; font-size: 0.9rem; }
</style>
```

- [ ] **Step 2: Buat Split-Screen Workspace (`src/pages/belajar/sql/[slug].astro`)**

Tulis `src/pages/belajar/sql/[slug].astro`:
```astro
---
import MainLayout from '../../../layouts/MainLayout.astro';
import { getSessionUser } from '../../../lib/auth';
import { initialSqlLessons } from '../../../lib/seedLessons';

const { slug } = Astro.params;
const lesson = initialSqlLessons.find(l => l.slug === slug) || initialSqlLessons[0];

const sessionId = Astro.cookies.get('session_id')?.value;
const user = await getSessionUser(sessionId);
---
<MainLayout title={`${lesson.title} | Belajar SQL`}>
  <div class="workspace-container">
    <!-- Panel Kiri: Teori & Instruksi -->
    <div class="panel panel-left glass-card">
      <div class="panel-header">
        <a href="/belajar/sql" class="back-link">← Kembali ke Katalog</a>
        <span class="badge">{lesson.category}</span>
      </div>
      <h2>{lesson.title}</h2>
      
      <div class="section-title">📖 Teori & Penjelasan:</div>
      <div class="theory-box" set:html={lesson.theory_markdown.replace(/\n/g, '<br/>')} />

      <div class="section-title" style="margin-top: 1.5rem;">🎯 Instruksi Tugas:</div>
      <div class="instruction-box">
        <p>{lesson.instructions_markdown}</p>
      </div>

      <div id="eval-status" class="eval-banner" style="display:none;"></div>
    </div>

    <!-- Panel Kanan: Code Editor & Result Table -->
    <div class="panel panel-right">
      <div class="editor-header glass-card">
        <span>⚡ SQL Code Editor</span>
        <div class="btn-group">
          <button id="run-btn" class="btn btn-secondary btn-sm">▶ Run Query</button>
          <button id="submit-btn" class="btn btn-primary btn-sm">🚀 Submit Answer</button>
        </div>
      </div>

      <div class="editor-box glass-card">
        <textarea id="sql-input" class="code-textarea">{lesson.initial_code}</textarea>
      </div>

      <div class="result-box glass-card">
        <div class="result-header">📊 Result / Output Table</div>
        <div id="output-table-container">
          <p class="placeholder-text">Klik <strong>Run Query</strong> untuk melihat hasil query SQL Anda.</p>
        </div>
      </div>
    </div>
  </div>
</MainLayout>

<script is:inline define:vars={{ seedSql: lesson.seed_sql, expectedSql: lesson.expected_sql, lessonId: lesson.order_index }}>
  const runBtn = document.getElementById('run-btn');
  const submitBtn = document.getElementById('submit-btn');
  const sqlInput = document.getElementById('sql-input');
  const tableContainer = document.getElementById('output-table-container');
  const evalStatus = document.getElementById('eval-status');

  runBtn?.addEventListener('click', async () => {
    const userSql = sqlInput.value;
    const res = await fetch('/api/sql/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedSql, userSql })
    });
    const data = await res.json();
    renderTable(data);
  });

  submitBtn?.addEventListener('click', async () => {
    const userSql = sqlInput.value;
    const res = await fetch('/api/sql/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, seedSql, expectedSql, userSql })
    });
    const data = await res.json();
    
    if (data.userResult) {
      renderTable(data.userResult);
    }

    if (evalStatus) {
      evalStatus.style.display = 'block';
      if (data.passed) {
        evalStatus.className = 'eval-banner eval-success';
        evalStatus.innerHTML = `🎉 <strong>${data.message}</strong>`;
      } else {
        evalStatus.className = 'eval-banner eval-error';
        evalStatus.innerHTML = `⚠️ <strong>${data.error}</strong>`;
      }
    }
  });

  function renderTable(data) {
    if (!tableContainer) return;
    if (data.error) {
      tableContainer.innerHTML = `<p class="error-text">❌ SQL Error: ${data.error}</p>`;
      return;
    }
    if (!data.columns || data.columns.length === 0) {
      tableContainer.innerHTML = `<p class="placeholder-text">Query berhasil dieksekusi tetapi tidak mengembalikan data.</p>`;
      return;
    }

    let html = '<table class="data-table"><thead><tr>';
    data.columns.forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr></thead><tbody>';
    data.values.forEach(row => {
      html += '<tr>';
      row.forEach(val => { html += `<td>${val}</td>`; });
      html += '</tr>';
    });
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
  }
</script>

<style>
  .workspace-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
  .panel { display: flex; flex-direction: column; gap: 1rem; }
  .panel-left { padding: 2rem; }
  .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .back-link { font-size: 0.85rem; color: var(--text-secondary); }
  .section-title { font-weight: 700; color: var(--accent-primary); font-size: 0.95rem; }
  .theory-box { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
  .instruction-box { background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--accent-primary); font-size: 0.95rem; }
  .editor-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; }
  .btn-group { display: flex; gap: 0.5rem; }
  .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
  .code-textarea { width: 100%; height: 180px; font-family: var(--font-mono); background: #090d16; color: #f8fafc; border: var(--glass-border); border-radius: var(--radius-sm); padding: 1rem; font-size: 0.95rem; line-height: 1.5; resize: vertical; }
  .result-box { padding: 1.25rem; min-height: 200px; }
  .result-header { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-secondary); }
  .placeholder-text { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
  .error-text { color: #f87171; font-size: 0.9rem; }
  .eval-banner { padding: 1rem; border-radius: var(--radius-sm); margin-top: 1rem; font-size: 0.95rem; }
  .eval-success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
  .eval-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; }
  @media (max-width: 900px) { .workspace-container { grid-template-columns: 1fr; } }
</style>

<style is:global>
  .data-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.85rem; }
  .data-table th, .data-table td { border: 1px solid var(--border-color); padding: 0.5rem 0.75rem; text-align: left; }
  .data-table th { background: var(--bg-secondary); color: var(--accent-primary); }
</style>
```

- [ ] **Step 3: Buat Halaman Dashboard Siswa (`src/pages/dashboard.astro`)**

Tulis `src/pages/dashboard.astro`:
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import { getSessionUser } from '../lib/auth';

const sessionId = Astro.cookies.get('session_id')?.value;
const user = await getSessionUser(sessionId);

if (!user) {
  return Astro.redirect('/auth/login');
}
---
<MainLayout title="Dashboard Siswa | Suhendar Aryadi">
  <div class="glass-card dashboard-card">
    <div class="user-header">
      <div class="avatar-box">👤</div>
      <div>
        <h1>{user.name}</h1>
        <p class="subtitle">{user.email} • Role: <span class="badge">{user.role}</span></p>
      </div>
    </div>
    
    <hr style="border:0; height:1px; background:var(--border-color); margin:1.5rem 0;" />

    <h2>📊 Progres Latihan SQL Anda</h2>
    <div class="stats-grid" style="margin-top:1rem;">
      <div class="stat-card glass-card">
        <span class="stat-num">3 / 3</span>
        <span class="stat-label">Modul SQL Tersedia</span>
      </div>
      <div class="stat-card glass-card">
        <span class="stat-num">100%</span>
        <span class="stat-label">Tingkat Penyelesaian</span>
      </div>
    </div>

    <div style="margin-top: 2rem;">
      <a href="/belajar/sql" class="btn btn-primary">📚 Lanjutkan Belajar SQL</a>
      <button id="logout-btn" class="btn btn-secondary" style="margin-left:0.5rem;">Logout</button>
    </div>
  </div>
</MainLayout>

<script>
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/auth/login';
  });
</script>

<style>
  .dashboard-card { padding: 2.5rem; }
  .user-header { display: flex; align-items: center; gap: 1.5rem; }
  .avatar-box { font-size: 3rem; background: var(--bg-secondary); padding: 0.5rem 1rem; border-radius: var(--radius-md); border: var(--glass-border); }
  .subtitle { color: var(--text-secondary); margin-top: 0.25rem; font-size: 0.95rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
  .stat-card { text-align: center; padding: 1.25rem; }
  .stat-num { display: block; font-size: 1.8rem; font-weight: 700; color: var(--accent-primary); }
  .stat-label { font-size: 0.85rem; color: var(--text-secondary); }
</style>
```

- [ ] **Step 4: Verifikasi build dan tipe Astro**

Run: `npx astro check`
Run: `npm run build`
Expected: 0 errors, SSR static + server routes terkompilasi dengan sukses.

- [ ] **Step 5: Commit**

```bash
git add src/pages/belajar/sql/ src/pages/dashboard.astro
git commit -m "feat: implement FreeCodeCamp interactive SQL catalog, split-screen workspace, and student dashboard"
```

---

### Task 7: Final Verification & Push to GitHub

**Files:**
- All repository files

- [ ] **Step 1: Jalankan `npm run build`**

Run: `npm run build`
Expected: Build sukses tanpa error.

- [ ] **Step 2: Commit & Push ke GitHub**

```bash
git add .
git commit -m "feat: complete interactive SQL learning platform implementation"
git push origin main
```
