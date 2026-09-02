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
    const res1 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
      ORDER BY s.id ASC
    `);
    
    fs.writeFileSync('scratch/ungraded_lkpd1.json', JSON.stringify(res1.rows, null, 2));
    console.log(`Saved ${res1.rows.length} ungraded LKPD 1 to scratch/ungraded_lkpd1.json`);

    const res2 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_flowchart_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
      ORDER BY s.id ASC
    `);
    
    fs.writeFileSync('scratch/ungraded_lkpd2.json', JSON.stringify(res2.rows, null, 2));
    console.log(`Saved ${res2.rows.length} ungraded LKPD 2 to scratch/ungraded_lkpd2.json`);
  } finally {
    client.release();
  }
}

main().catch(console.error);
