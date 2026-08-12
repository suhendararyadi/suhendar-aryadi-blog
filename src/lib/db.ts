import { createPool } from '@vercel/postgres';
import { seedLessons } from './seedLessons';

interface MemoryUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

interface MemorySession {
  id: string;
  user_id: number;
  expires_at: string;
}

interface MemoryProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  status: string;
  submitted_code: string;
  completed_at: string;
}

interface MemoryEnrollment {
  id: number;
  user_id: number;
  course_id: string;
  enrolled_at: string;
}

const memoryUsers: MemoryUser[] = [];
const memorySessions: MemorySession[] = [];
const memoryProgress: MemoryProgress[] = [];
const memoryEnrollments: MemoryEnrollment[] = [];
let nextUserId = 1;
let nextProgressId = 1;
let nextEnrollmentId = 1;
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

  CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
  );

  INSERT INTO course_enrollments (user_id, course_id)
  SELECT DISTINCT user_id, 'bk' FROM lkpd_submissions
  ON CONFLICT (user_id, course_id) DO NOTHING;

  INSERT INTO course_enrollments (user_id, course_id)
  SELECT DISTINCT user_id, 'tik' FROM lkpd_tik_submissions
  ON CONFLICT (user_id, course_id) DO NOTHING;

  INSERT INTO course_enrollments (user_id, course_id)
  SELECT DISTINCT user_id, 'sql' FROM user_progress
  ON CONFLICT (user_id, course_id) DO NOTHING;
`;

async function seedLessonsPg(client: any) {
  for (const lesson of seedLessons) {
    await client.query(`
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
  await client.query(`SELECT setval(pg_get_serial_sequence('sql_lessons', 'id'), (SELECT MAX(id) FROM sql_lessons));`);
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
          await seedLessonsPg(client);
          tablesInitializedPg = true;
        }
        const result = await client.query(text, params);
        return { rows: result.rows };
      } finally {
        client.release();
      }
    } catch (pgError) {
      console.warn('Vercel Postgres query failed, falling back to pure JS memory store:', pgError);
    }
  }

  // Pure JS Memory Store fallback (Zero binary/WASM dependency, 100% resilient)
  const normText = text.trim().replace(/\s+/g, ' ');

  // 1. SELECT id FROM users WHERE email = $1 / SELECT id, name, email... FROM users WHERE email = $1
  if (normText.toUpperCase().includes('FROM USERS WHERE EMAIL =')) {
    const email = String(params[0] || '').toLowerCase();
    const user = memoryUsers.find((u) => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [] };
  }

  // 2. SELECT * FROM users WHERE id = $1 / SELECT id, name... FROM users WHERE id = $1
  if (normText.toUpperCase().includes('FROM USERS WHERE ID =')) {
    const id = Number(params[0]);
    const user = memoryUsers.find((u) => u.id === id);
    return { rows: user ? [user] : [] };
  }

  // 3. INSERT INTO users ...
  if (normText.toUpperCase().startsWith('INSERT INTO USERS')) {
    const name = String(params[0] || '');
    const email = String(params[1] || '').toLowerCase();
    const password_hash = String(params[2] || '');
    const role = String(params[3] || 'student');
    const newUser: MemoryUser = {
      id: nextUserId++,
      name,
      email,
      password_hash,
      role,
      created_at: new Date().toISOString(),
    };
    memoryUsers.push(newUser);
    return { rows: [newUser] };
  }

  // 4. INSERT INTO sessions ...
  if (normText.toUpperCase().startsWith('INSERT INTO SESSIONS')) {
    const id = String(params[0] || '');
    const user_id = Number(params[1]);
    const expires_at = String(params[2] || '');
    memorySessions.push({ id, user_id, expires_at });
    return { rows: [] };
  }

  // 5. DELETE FROM sessions WHERE id = $1
  if (normText.toUpperCase().startsWith('DELETE FROM SESSIONS')) {
    const id = String(params[0] || '');
    const idx = memorySessions.findIndex((s) => s.id === id);
    if (idx !== -1) memorySessions.splice(idx, 1);
    return { rows: [] };
  }

  // 6. SELECT user_id FROM sessions WHERE id = $1 AND expires_at > $2
  if (normText.toUpperCase().includes('FROM SESSIONS')) {
    const sessionId = String(params[0] || '');
    const session = memorySessions.find((s) => s.id === sessionId);
    if (session) {
      return { rows: [{ id: session.id, user_id: session.user_id, expires_at: session.expires_at }] };
    }
    return { rows: [] };
  }

  // 7. SELECT * FROM sql_lessons ...
  if (normText.toUpperCase().includes('FROM SQL_LESSONS')) {
    if (normText.toUpperCase().includes('WHERE SLUG =')) {
      const slug = String(params[0] || '');
      const lesson = seedLessons.find((l) => l.slug === slug);
      return { rows: lesson ? [lesson] : [] };
    }
    return { rows: seedLessons };
  }

  // 8. INSERT INTO user_progress ...
  if (normText.toUpperCase().startsWith('INSERT INTO USER_PROGRESS')) {
    const userId = Number(params[0]);
    const lessonId = Number(params[1]);
    const submittedCode = String(params[2] || '');
    const existingIdx = memoryProgress.findIndex((p) => p.user_id === userId && p.lesson_id === lessonId);
    const progRecord: MemoryProgress = {
      id: existingIdx !== -1 ? memoryProgress[existingIdx].id : nextProgressId++,
      user_id: userId,
      lesson_id: lessonId,
      status: 'completed',
      submitted_code: submittedCode,
      completed_at: new Date().toISOString(),
    };
    if (existingIdx !== -1) {
      memoryProgress[existingIdx] = progRecord;
    } else {
      memoryProgress.push(progRecord);
    }
    return { rows: [progRecord] };
  }

  // 9. SELECT * FROM user_progress ...
  if (normText.toUpperCase().includes('FROM USER_PROGRESS')) {
    const userId = Number(params[0]);
    const userProgs = memoryProgress.filter((p) => p.user_id === userId);
    return { rows: userProgs };
  }

  // 10. INSERT INTO course_enrollments ...
  if (normText.toUpperCase().includes('INSERT INTO COURSE_ENROLLMENTS')) {
    const userId = Number(params[0]);
    const courseId = String(params[1] || '').toLowerCase();
    const existing = memoryEnrollments.find((e) => e.user_id === userId && e.course_id === courseId);
    if (!existing) {
      memoryEnrollments.push({
        id: nextEnrollmentId++,
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString()
      });
    }
    return { rows: [] };
  }

  // 11. SELECT ... FROM course_enrollments ...
  if (normText.toUpperCase().includes('FROM COURSE_ENROLLMENTS')) {
    const userId = Number(params[0]);
    const userEnrollments = memoryEnrollments.filter((e) => e.user_id === userId);
    return { rows: userEnrollments };
  }

  return { rows: [] };
}
