import type { APIRoute } from 'astro';
import { getSessionUser } from '@/lib/auth';
import { query } from '@/lib/db';

const SUBJECT_MAP: Record<string, string> = {
  informatika: 'informatika',
  bk: 'informatika',
  tik: 'informatika',
  sk: 'informatika',
  ap: 'informatika',
  rpl_web_sql: 'rpl_web_sql',
  sql: 'rpl_web_sql',
  'html-css': 'rpl_web_sql',
  js: 'rpl_web_sql',
  pbo: 'pbo'
};

const VALID_CODES_PER_SUBJECT: Record<string, string[]> = {
  informatika: ['INFORMATIKA2026', 'INF2026', 'BK2026', 'TIK2026', 'SK2026', 'AP2026', 'RPL2026'],
  rpl_web_sql: ['RPL2026', 'BASISDATA2026', 'SQL2026', 'WEB2026', 'INFORMATIKA2026'],
  pbo: ['PBO2026', 'RPL2026', 'INFORMATIKA2026']
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Silakan login terlebih dahulu.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json().catch(() => ({}));
    const rawCourseOrSubjectId = String(body.subjectId || body.courseId || '').trim().toLowerCase();
    const accessCode = String(body.accessCode || '').trim().toUpperCase();

    const subjectId = SUBJECT_MAP[rawCourseOrSubjectId];
    const validCodes = subjectId ? VALID_CODES_PER_SUBJECT[subjectId] : null;

    if (!subjectId || !validCodes || !validCodes.includes(accessCode)) {
      return new Response(JSON.stringify({ error: 'Kode akses mata pelajaran salah. Hubungi Guru (Pak Suhendar) untuk mendapatkan kode akses.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await query(
      `INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [user.id, subjectId]
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Berhasil terdaftar pada Mata Pelajaran!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error enrolling subject:', error);
    return new Response(JSON.stringify({ error: 'Gagal mendaftar Mata Pelajaran: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
