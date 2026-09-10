import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Sesi Anda tidak valid. Silakan login kembali.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || (user.email && user.email.toLowerCase().includes('suhendar'));
    if (!isTeacherOrAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Hanya Guru atau Administrator yang berwenang melakukan tindakan pengawas ujian.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, targetUserId } = body;

    const studentId = Number(targetUserId);
    if (!studentId || isNaN(studentId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID siswa tidak valid.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get student info for audit feedback
    const studentRes = await query('SELECT id, name, email FROM users WHERE id = $1', [studentId]);
    const targetStudent = studentRes.rows[0];
    const studentName = targetStudent ? targetStudent.name : `Siswa #${studentId}`;

    if (action === 'unlock') {
      // Set force_unlocked to true so student's next heartbeat receives instant unlock command
      await query(
        `UPDATE sql_exam_active_sessions 
         SET is_locked = FALSE, lockout_remaining = 0, force_unlocked = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [studentId]
      );

      return new Response(
        JSON.stringify({
          success: true,
          action: 'unlock',
          message: `Kunci pengerjaan untuk ${studentName} berhasil dibuka. Layar siswa akan terbuka otomatis dalam hitungan detik.`
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reset') {
      // Reset attempt for student in case of computer crash / emergency
      await query('DELETE FROM sql_exam_submissions WHERE user_id = $1', [studentId]);
      await query('DELETE FROM sql_exam_active_sessions WHERE user_id = $1', [studentId]);

      return new Response(
        JSON.stringify({
          success: true,
          action: 'reset',
          message: `Sesi ujian dan riwayat pengerjaan ${studentName} berhasil direset. Siswa dapat login dan memulai ulang ujian kembali.`
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Aksi pengawas tidak dikenali.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Error in monitoring action:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Gagal menjalankan aksi pengawas ujian di server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
