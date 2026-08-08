import type { APIRoute } from 'astro';
import { getSessionUser } from '@/lib/auth';
import { query } from '@/lib/db';

const UNIVERSAL_CODES = ['RPL2026', 'INFORMATIKA2026'];
const COURSE_CODES: Record<string, string> = {
  bk: 'BK2026',
  tik: 'TIK2026',
  sql: 'SQL2026',
  sk: 'SK2026',
  ap: 'AP2026'
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
    const { courseId, accessCode } = body;

    const trimmedCode = String(accessCode || '').trim().toUpperCase();
    const normalizedCourseId = String(courseId || '').trim().toLowerCase();

    const isValidCode = UNIVERSAL_CODES.includes(trimmedCode) || COURSE_CODES[normalizedCourseId] === trimmedCode;

    if (!normalizedCourseId || !isValidCode) {
      return new Response(JSON.stringify({ error: 'Kode akses modul salah. Hubungi Guru (Pak Suhendar) untuk mendapatkan kode akses.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await query(
      `INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [user.id, normalizedCourseId]
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Berhasil mendaftar pada modul pembelajaran!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error enrolling course:', error);
    return new Response(JSON.stringify({ error: 'Gagal mendaftar modul pembelajaran: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
