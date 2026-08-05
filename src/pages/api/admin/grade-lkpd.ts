import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('suhendar'));

    if (!user || !isTeacherOrAdmin) {
      return new Response(JSON.stringify({ error: 'Akses ditolak. Hanya Guru / Admin yang dapat menilai LKPD.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { submissionId, score, teacherFeedback } = await request.json();

    if (!submissionId) {
      return new Response(JSON.stringify({ error: 'ID Submission tidak valid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await query(
      `UPDATE lkpd_submissions 
       SET score = $1, teacher_feedback = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [score !== undefined ? parseInt(score, 10) : null, teacherFeedback || '', submissionId]
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Penilaian LKPD dan umpan balik berhasil disimpan!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error grading LKPD:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan nilai: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
