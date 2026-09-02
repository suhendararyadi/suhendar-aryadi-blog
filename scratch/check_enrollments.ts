import fs from 'fs';
import { createPool } from '@vercel/postgres';

function getEnvUrl() {
  const paths = ['.env.local', '.vercel/.env.production.local'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      for (const line of content.split('\n')) {
        if (line.startsWith('POSTGRES_URL=') || line.startsWith('DATABASE_URL=')) {
          const raw = line.split('=')[1]?.trim();
          if (raw) {
            return raw.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
}

async function main() {
  const connStr = getEnvUrl();
  const pool = createPool({ connectionString: connStr });
  const client = await pool.connect();

  try {
    const userRes = await client.query(`SELECT COUNT(*) as count FROM users WHERE role = 'student'`);
    console.log(`Total students in users: ${userRes.rows[0].count}`);

    const enrollRes = await client.query(`
      SELECT course_id, COUNT(DISTINCT user_id) as student_count
      FROM course_enrollments
      GROUP BY course_id
    `);
    console.log('Course enrollments distribution:', enrollRes.rows);

    // Sync all students who have any LKPD submission or class_name starting with X to 'informatika'
    const syncRes = await client.query(`
      INSERT INTO course_enrollments (user_id, course_id)
      SELECT DISTINCT id, 'informatika'
      FROM users
      WHERE role = 'student'
      ON CONFLICT (user_id, course_id) DO NOTHING
    `);
    console.log('Synchronized all students to informatika course_enrollments');

    const enrollAfter = await client.query(`
      SELECT course_id, COUNT(DISTINCT user_id) as student_count
      FROM course_enrollments
      GROUP BY course_id
    `);
    console.log('Course enrollments after sync:', enrollAfter.rows);
  } finally {
    client.release();
  }
}

main().catch(console.error);
