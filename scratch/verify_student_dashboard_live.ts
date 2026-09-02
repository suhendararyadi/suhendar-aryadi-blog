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
    // Pick 5 sample students from Class X
    const sampleStudents = await client.query(`
      SELECT id, name, email, class_name
      FROM users
      WHERE role = 'student' AND (class_name ILIKE 'X%' OR class_name ILIKE '%RPL%')
      LIMIT 5
    `);

    console.log('=== VERIFYING DASHBOARD DATA FOR 5 SAMPLE CLASS X STUDENTS ===');
    for (const student of sampleStudents.rows) {
      console.log(`\n--------------------------------------------------------------`);
      console.log(`Siswa: ${student.name} (${student.email}) | Kelas: ${student.class_name}`);

      // Check course enrollment
      const enrollRes = await client.query(`
        SELECT course_id FROM course_enrollments WHERE user_id = $1
      `, [student.id]);
      const enrollList = enrollRes.rows.map(r => r.course_id);
      console.log(`- Enrolled Courses: [${enrollList.join(', ')}]`);

      // Check LKPD 1 (BK 4 Pilar)
      const lkpd1 = await client.query(`
        SELECT score, teacher_feedback FROM lkpd_submissions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1
      `, [student.id]);
      if (lkpd1.rows.length > 0) {
        console.log(`- [LKPD 1 BK]: Nilai = ${lkpd1.rows[0].score}/100 | Feedback = "${lkpd1.rows[0].teacher_feedback?.substring(0, 60)}..."`);
      } else {
        console.log(`- [LKPD 1 BK]: Belum Mengerjakan`);
      }

      // Check LKPD 2 (Flowchart & Pseudocode)
      const lkpd2 = await client.query(`
        SELECT score, teacher_feedback FROM lkpd_flowchart_submissions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1
      `, [student.id]);
      if (lkpd2.rows.length > 0) {
        console.log(`- [LKPD 2 Flowchart]: Nilai = ${lkpd2.rows[0].score}/100 | Feedback = "${lkpd2.rows[0].teacher_feedback?.substring(0, 60)}..."`);
      } else {
        console.log(`- [LKPD 2 Flowchart]: Belum Mengerjakan`);
      }

      // Check LKPD TIK
      const lkpdTik = await client.query(`
        SELECT score, teacher_feedback FROM lkpd_tik_submissions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1
      `, [student.id]);
      if (lkpdTik.rows.length > 0) {
        console.log(`- [LKPD TIK]: Nilai = ${lkpdTik.rows[0].score}/100 | Feedback = "${lkpdTik.rows[0].teacher_feedback?.substring(0, 60)}..."`);
      } else {
        console.log(`- [LKPD TIK]: Belum Mengerjakan`);
      }
    }
  } finally {
    client.release();
  }
}

main().catch(console.error);
