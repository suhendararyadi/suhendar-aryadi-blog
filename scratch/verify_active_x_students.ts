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
    const students = await client.query(`
      SELECT u.id, u.name, u.email, u.class_name,
             lk1.score as lkpd1_score, lk1.teacher_feedback as lkpd1_feedback,
             lk2.score as lkpd2_score, lk2.teacher_feedback as lkpd2_feedback
      FROM users u
      JOIN lkpd_submissions lk1 ON u.id = lk1.user_id
      LEFT JOIN lkpd_flowchart_submissions lk2 ON u.id = lk2.user_id
      ORDER BY lk1.updated_at DESC
      LIMIT 8
    `);

    console.log('=== AKTIVITAS SISWA KELAS X DENGAN NILAI TERBARU ===');
    for (const s of students.rows) {
      console.log(`\n👨‍🎓 [Siswa]: ${s.name} (${s.email}) | Kelas: ${s.class_name || 'X RPL'}`);
      console.log(`   📝 LKPD 1 (4 Pilar BK): Nilai ${s.lkpd1_score}/100`);
      console.log(`      Catatan Guru: "${s.lkpd1_feedback?.substring(0, 75)}..."`);
      console.log(`   📊 LKPD 2 (Flowchart & Pseudocode): Nilai ${s.lkpd2_score !== null ? s.lkpd2_score + '/100' : 'Belum Submit'}`);
      if (s.lkpd2_feedback) console.log(`      Catatan Guru: "${s.lkpd2_feedback?.substring(0, 75)}..."`);
    }
  } finally {
    client.release();
  }
}

main().catch(console.error);
