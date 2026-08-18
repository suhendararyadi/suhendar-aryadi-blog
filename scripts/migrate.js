import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { seedLessons } from '../src/lib/seedLessons.js';

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
      class_name VARCHAR(50) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS class_name VARCHAR(50) DEFAULT '';

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
      path_id VARCHAR(50) DEFAULT 'basics',
      order_index INT NOT NULL,
      theory_markdown TEXT NOT NULL,
      instructions_markdown TEXT NOT NULL,
      seed_sql TEXT NOT NULL,
      expected_sql TEXT NOT NULL,
      initial_code TEXT DEFAULT 'SELECT * FROM customers;',
      evaluator_type VARCHAR(50) DEFAULT 'data_match'
    );

    ALTER TABLE sql_lessons ADD COLUMN IF NOT EXISTS path_id VARCHAR(50) DEFAULT 'basics';
    ALTER TABLE sql_lessons ADD COLUMN IF NOT EXISTS evaluator_type VARCHAR(50) DEFAULT 'data_match';

    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INT REFERENCES sql_lessons(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'completed',
      submitted_code TEXT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS lkpd_submissions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      case_study_id VARCHAR(50) NOT NULL,
      team_name VARCHAR(150) DEFAULT '',
      team_members TEXT NOT NULL,
      decomposition_json TEXT NOT NULL,
      pattern_json TEXT NOT NULL,
      abstraction_json TEXT NOT NULL,
      algorithm_json TEXT NOT NULL,
      score INT DEFAULT NULL,
      teacher_feedback TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lkpd_tik_submissions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      case_study_id VARCHAR(50) NOT NULL,
      team_name VARCHAR(150) DEFAULT '',
      team_members TEXT DEFAULT '[]',
      mail_merge_json TEXT DEFAULT '{}',
      search_operators_json TEXT DEFAULT '{}',
      reflection_json TEXT DEFAULT '{}',
      score INT DEFAULT NULL,
      teacher_feedback TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lkpd_flowchart_submissions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      case_study_id VARCHAR(50) NOT NULL,
      team_name VARCHAR(150) DEFAULT '',
      flowchart_json TEXT DEFAULT '[]',
      pseudocode_text TEXT DEFAULT '',
      score INT DEFAULT NULL,
      teacher_feedback TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS course_enrollments (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      course_id VARCHAR(50) NOT NULL,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, course_id)
    );

    INSERT INTO course_enrollments (user_id, course_id)
    SELECT DISTINCT user_id, 'informatika' FROM lkpd_submissions
    ON CONFLICT (user_id, course_id) DO NOTHING;

    INSERT INTO course_enrollments (user_id, course_id)
    SELECT DISTINCT user_id, 'informatika' FROM lkpd_flowchart_submissions
    ON CONFLICT (user_id, course_id) DO NOTHING;

    INSERT INTO course_enrollments (user_id, course_id)
    SELECT DISTINCT user_id, 'informatika' FROM lkpd_tik_submissions
    ON CONFLICT (user_id, course_id) DO NOTHING;

    INSERT INTO course_enrollments (user_id, course_id)
    SELECT DISTINCT user_id, 'rpl_web_sql' FROM user_progress
    ON CONFLICT (user_id, course_id) DO NOTHING;
  `);

  console.log('Seeding sql_lessons table on Neon Postgres...');

  for (const lesson of seedLessons) {
    await db.query(`
      INSERT INTO sql_lessons (id, slug, title, category, path_id, order_index, theory_markdown, instructions_markdown, seed_sql, expected_sql, initial_code, evaluator_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        path_id = EXCLUDED.path_id,
        order_index = EXCLUDED.order_index,
        theory_markdown = EXCLUDED.theory_markdown,
        instructions_markdown = EXCLUDED.instructions_markdown,
        seed_sql = EXCLUDED.seed_sql,
        expected_sql = EXCLUDED.expected_sql,
        initial_code = EXCLUDED.initial_code,
        evaluator_type = EXCLUDED.evaluator_type;
    `, [
      lesson.id,
      lesson.slug,
      lesson.title,
      lesson.category,
      lesson.path_id,
      lesson.order_index,
      lesson.theory_markdown,
      lesson.instructions_markdown,
      lesson.seed_sql,
      lesson.expected_sql,
      lesson.initial_code,
      lesson.evaluator_type
    ]);
  }

  // Synchronize sequence for sql_lessons table ID
  await db.query(`SELECT setval(pg_get_serial_sequence('sql_lessons', 'id'), (SELECT MAX(id) FROM sql_lessons));`);

  console.log('Migrations and lesson seeding completed successfully on Neon Postgres!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
