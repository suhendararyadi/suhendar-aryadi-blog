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
    console.log('====================================================');
    console.log('=== LKPD 1 SUBMISSIONS (lkpd_submissions) ===');
    console.log('====================================================');
    const res1 = await client.query(`
      SELECT s.id, s.user_id, u.name as student_name, u.email as student_email, s.case_study_id, s.team_name, s.score, s.feedback, s.created_at, s.updated_at
      FROM lkpd_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.updated_at DESC
    `);
    console.log(`Total LKPD 1: ${res1.rows.length}`);
    const ungr1 = res1.rows.filter(r => r.score === null);
    console.log(`Ungraded LKPD 1: ${ungr1.length}`);
    for (const r of res1.rows) {
      console.log(`- ID: ${r.id} | Name: ${r.student_name} (${r.student_email}) | Team: ${r.team_name} | Case: ${r.case_study_id} | Score: ${r.score !== null ? r.score : 'BELUM DINILAI'} | Updated: ${r.updated_at}`);
    }

    console.log('\n====================================================');
    console.log('=== LKPD 2 SUBMISSIONS (lkpd_flowchart_submissions) ===');
    console.log('====================================================');
    const res2 = await client.query(`
      SELECT s.id, s.user_id, u.name as student_name, u.email as student_email, s.case_study_id, s.team_name, s.score, s.teacher_feedback, s.created_at, s.updated_at
      FROM lkpd_flowchart_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.updated_at DESC
    `);
    console.log(`Total LKPD 2: ${res2.rows.length}`);
    const ungr2 = res2.rows.filter(r => r.score === null);
    console.log(`Ungraded LKPD 2: ${ungr2.length}`);
    for (const r of res2.rows) {
      console.log(`- ID: ${r.id} | Name: ${r.student_name} (${r.student_email}) | Team: ${r.team_name} | Case: ${r.case_study_id} | Score: ${r.score !== null ? r.score : 'BELUM DINILAI'} | Updated: ${r.updated_at}`);
    }
  } finally {
    client.release();
  }
}

main().catch(console.error);
