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
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN score IS NULL THEN 1 END) as ungraded,
             COUNT(CASE WHEN score >= 75 THEN 1 END) as passed,
             ROUND(AVG(score), 1) as avg_score
      FROM lkpd_submissions
    `);
    console.log('=== LKPD 1 RECAP ===');
    console.log(res1.rows[0]);

    const res2 = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN score IS NULL THEN 1 END) as ungraded,
             COUNT(CASE WHEN score >= 75 THEN 1 END) as passed,
             ROUND(AVG(score), 1) as avg_score
      FROM lkpd_flowchart_submissions
    `);
    console.log('=== LKPD 2 RECAP ===');
    console.log(res2.rows[0]);
  } finally {
    client.release();
  }
}

main().catch(console.error);
