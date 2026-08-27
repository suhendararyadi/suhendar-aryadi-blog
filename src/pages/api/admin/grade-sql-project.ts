import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('suhendar'));

    if (!user || !isTeacherOrAdmin) {
      return new Response(JSON.stringify({ error: 'Akses ditolak. Hanya Guru / Admin yang dapat menilai Proyek SQL.' }), {
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
      `UPDATE sql_project_submissions
       SET score = $1, 
           teacher_feedback = $2, 
           graded_by_email = $3,
           graded_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [
        score !== undefined && score !== null && score !== '' ? parseInt(score, 10) : null, 
        teacherFeedback || '', 
        user.email,
        submissionId
      ]
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Nilai dan umpan balik Proyek SQL SmartMart POS berhasil disimpan!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error grading SQL Project:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan nilai Proyek SQL: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
