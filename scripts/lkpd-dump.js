import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

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

const db = createPool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL });

const ids = process.argv.slice(2).map(Number).filter(Boolean);

async function dump() {
  const res = await db.query(
    `SELECT s.id, u.name AS student_name, u.class_name, s.case_study_id, s.team_name, s.team_members,
            s.decomposition_json, s.pattern_json, s.abstraction_json, s.algorithm_json
     FROM lkpd_submissions s LEFT JOIN users u ON u.id = s.user_id
     WHERE s.id = ANY($1::int[]) ORDER BY s.id ASC;`,
    [ids]
  );

  for (const r of res.rows) {
    console.log('\n' + '='.repeat(70));
    console.log(`SUBMISSION #${r.id} | ${r.student_name} | ${r.class_name} | studi kasus: ${r.case_study_id}`);
    console.log(`Tim: ${r.team_name} | Anggota: ${r.team_members}`);
    console.log('-'.repeat(70));
    const pretty = (label, raw) => {
      console.log(`\n### ${label}`);
      try { console.log(JSON.stringify(JSON.parse(raw), null, 2)); }
      catch { console.log(raw); }
    };
    pretty('DEKOMPOSISI', r.decomposition_json);
    pretty('PENGENALAN POLA', r.pattern_json);
    pretty('ABSTRAKSI', r.abstraction_json);
    pretty('ALGORITMA & STRUKTUR DATA', r.algorithm_json);
  }
  await db.end();
  process.exit(0);
}

dump().catch(err => { console.error('Dump failed:', err.message); process.exit(1); });
