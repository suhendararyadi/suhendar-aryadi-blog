import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Load .env.local (same loader as migrate.js) — never prints secret values
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

async function audit() {
  const res = await db.query(`
    SELECT s.id, u.name AS student_name, u.class_name, s.case_study_id, s.team_name,
           s.score, (s.teacher_feedback IS NOT NULL AND s.teacher_feedback <> '') AS has_feedback,
           s.created_at, s.updated_at
    FROM lkpd_submissions s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.id ASC;
  `);

  const rows = res.rows;
  const total = rows.length;
  const graded = rows.filter(r => r.score !== null && r.score !== undefined).length;
  const ungraded = rows.filter(r => r.score === null || r.score === undefined);

  console.log('=== LKPD 1 (BK) SUBMISSION AUDIT ===');
  console.log(`Total submissions : ${total}`);
  console.log(`Sudah dinilai     : ${graded}`);
  console.log(`Belum dinilai     : ${ungraded.length}`);
  console.log('');

  if (ungraded.length > 0) {
    console.log('--- BELUM DINILAI (score IS NULL) ---');
    for (const r of ungraded) {
      console.log(`#${r.id} | ${r.student_name || '(?)'} | ${r.class_name || '-'} | studi kasus: ${r.case_study_id} | tim: ${r.team_name || '-'} | dibuat: ${r.created_at}`);
    }
  } else {
    console.log('Semua submission sudah dinilai. Tidak ada yang pending.');
  }

  // Score distribution for graded ones
  if (graded > 0) {
    const scores = rows.filter(r => r.score !== null).map(r => Number(r.score));
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    console.log('');
    console.log(`--- STATISTIK NILAI (yang sudah dinilai) ---`);
    console.log(`Rata-rata: ${avg} | Min: ${min} | Max: ${max}`);
  }

  await db.end();
  process.exit(0);
}

audit().catch(err => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
