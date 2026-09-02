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
    console.log('=== UNGRADED LKPD 1 (lkpd_submissions) ===');
    const res1 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
      ORDER BY s.id ASC
    `);
    console.log(`Found ${res1.rows.length} ungraded in LKPD 1`);
    for (const r of res1.rows) {
      console.log(`\n======================================================`);
      console.log(`ID: ${r.id} | User: ${r.student_name} (${r.student_email}) | Team: ${r.team_name} | Case: ${r.case_study_id}`);
      console.log(`Team Members: ${r.team_members}`);
      console.log(`Decomposition:`, r.decomposition_json);
      console.log(`Pattern:`, r.pattern_json);
      console.log(`Abstraction:`, r.abstraction_json);
      console.log(`Algorithm:`, r.algorithm_json);
      console.log(`Reflection:`, r.reflection_json);
    }

    console.log('\n\n=== UNGRADED LKPD 2 (lkpd_flowchart_submissions) ===');
    const res2 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_flowchart_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
      ORDER BY s.id ASC
    `);
    console.log(`Found ${res2.rows.length} ungraded in LKPD 2`);
    for (const r of res2.rows) {
      console.log(`\n======================================================`);
      console.log(`ID: ${r.id} | User: ${r.student_name} (${r.student_email}) | Team: ${r.team_name} | Case: ${r.case_study_id}`);
      console.log(`Flowchart JSON:`, r.flowchart_json);
      console.log(`Pseudocode Text:`, r.pseudocode_text);
    }
  } finally {
    client.release();
  }
}

main().catch(console.error);
