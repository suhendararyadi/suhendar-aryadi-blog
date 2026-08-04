import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Load .env.local if present
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const db = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL
});

async function migrate() {
  console.log('Running SQL Platform migrations on Neon Postgres...');
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
  console.log('Migrations completed successfully on Neon Postgres!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
