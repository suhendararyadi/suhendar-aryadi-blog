import fs from 'fs';
import { createPool } from '@vercel/postgres';

function getEnvUrl() {
  const paths = ['.vercel/.env.production.local', '.env.local', '.env'];
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
  if (!connStr) {
    console.error('No connection string found!');
    return;
  }
  const pool = createPool({ connectionString: connStr });
  const client = await pool.connect();

  try {
    const res = await client.query(`
      SELECT s.id, s.user_id, u.name as student_name, u.email as student_email, u.role,
             s.token_used, s.total_questions, s.correct_answers, s.score,
             s.duration_seconds, s.violation_count, s.is_disqualified, s.disqualification_reason,
             s.created_at
      FROM sql_exam_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);

    console.log(`TOTAL SUBMISSIONS FOUND: ${res.rows.length}`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error querying sql_exam_submissions:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

main();
