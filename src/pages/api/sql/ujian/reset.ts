import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Sesi Anda tidak valid. Silakan login terlebih dahulu.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || (user.email && user.email.toLowerCase().includes('suhendar'));
    if (!isTeacherOrAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Hanya Guru atau Administrator yang memiliki akses untuk mereset riwayat ujian.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await query('DELETE FROM sql_exam_submissions WHERE user_id = $1', [user.id]);

    return new Response(
      JSON.stringify({ success: true, message: 'Riwayat sesi pengujian Anda berhasil direset.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error resetting admin exam submission:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Gagal mereset riwayat ujian di server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
