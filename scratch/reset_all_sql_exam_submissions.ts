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
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM sql_exam_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.id ASC
    `);

    fs.writeFileSync(
      'scratch/backup_sql_exam_submissions_compensation.json',
      JSON.stringify(res.rows, null, 2)
    );
    console.log(`Backed up ${res.rows.length} rows to scratch/backup_sql_exam_submissions_compensation.json`);

    // Reset all records from sql_exam_submissions as explicitly requested by the teacher/admin
    const deleteRes = await client.query('DELETE FROM sql_exam_submissions RETURNING id, user_id');
    console.log(`Successfully deleted/reset ${deleteRes.rowCount} submissions from sql_exam_submissions!`);
  } catch (err) {
    console.error('Error during backup and reset:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

main();
