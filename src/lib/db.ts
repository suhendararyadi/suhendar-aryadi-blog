import { createPool } from '@vercel/postgres';
import initSqlJs from 'sql.js';

let sqliteDb: any = null;
let tablesInitializedPg = false;

const CREATE_TABLES_PG = `
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
`;

const CREATE_TABLES_SQLITE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    expires_at DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sql_lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    theory_markdown TEXT NOT NULL,
    instructions_markdown TEXT NOT NULL,
    seed_sql TEXT NOT NULL,
    expected_sql TEXT NOT NULL,
    initial_code TEXT DEFAULT 'SELECT * FROM customers;'
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    status TEXT DEFAULT 'completed',
    submitted_code TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
  );
`;

async function getSqliteDb() {
  if (!sqliteDb) {
    const SQL = await initSqlJs();
    sqliteDb = new SQL.Database();
    sqliteDb.run(CREATE_TABLES_SQLITE);
  }
  return sqliteDb;
}

export async function query(text: string, params: any[] = []): Promise<{ rows: any[] }> {
  const hasPgUrl = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

  if (hasPgUrl) {
    try {
      const pool = createPool({
        connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL
      });
      const client = await pool.connect();
      try {
        if (!tablesInitializedPg) {
          await client.query(CREATE_TABLES_PG);
          tablesInitializedPg = true;
        }
        const result = await client.query(text, params);
        return { rows: result.rows };
      } finally {
        client.release();
      }
    } catch (pgError) {
      console.warn('Vercel Postgres query failed, falling back to in-memory SQLite sandbox:', pgError);
    }
  }

  // Fallback to in-memory SQLite sandbox
  const sdb = await getSqliteDb();

  // Convert Postgres parameter syntax $1, $2 to SQLite parameter marker ?
  let sqliteQuery = text.replace(/\$\d+/g, '?');

  // Handle RETURNING clause for SQLite
  const isReturning = /RETURNING\s+([a-z0-9_,\s]+)/i.exec(sqliteQuery);
  if (isReturning) {
    sqliteQuery = sqliteQuery.replace(/RETURNING\s+[a-z0-9_,\s]+/i, '');
  }

  try {
    const trimmed = sqliteQuery.trim().toUpperCase();
    const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('WITH');

    if (isSelect) {
      const stmt = sdb.prepare(sqliteQuery);
      stmt.bind(params);
      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return { rows };
    } else {
      sdb.run(sqliteQuery, params);
      if (isReturning) {
        const lastIdRes = sdb.exec('SELECT last_insert_rowid() as id');
        const lastId = lastIdRes[0]?.values[0]?.[0];
        if (lastId !== undefined) {
          const tableNameMatch = /INSERT\s+INTO\s+([a-z0-9_]+)/i.exec(sqliteQuery);
          const tableName = tableNameMatch ? tableNameMatch[1] : 'users';
          const stmt = sdb.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
          stmt.bind([lastId]);
          const rows: any[] = [];
          if (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          return { rows };
        }
      }
      return { rows: [] };
    }
  } catch (err: any) {
    console.error('SQLite Fallback error:', err, 'Query:', sqliteQuery);
    throw err;
  }
}
