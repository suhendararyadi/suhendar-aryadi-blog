import type { APIRoute } from 'astro';
import { evaluateSolution } from '../../../lib/sqlEvaluator';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let lessonId: number | null = null;
    let seedSql = '';
    let expectedSql = '';
    let userSql = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.lessonId || body.lesson_id) {
        lessonId = parseInt(body.lessonId || body.lesson_id, 10);
      }
      seedSql = body.seedSql || body.seed_sql || '';
      expectedSql = body.expectedSql || body.expected_sql || '';
      userSql = body.userSql || body.user_sql || body.sql || '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const rawLessonId = formData.get('lessonId') || formData.get('lesson_id');
      if (rawLessonId) {
        lessonId = parseInt(rawLessonId as string, 10);
      }
      seedSql = ((formData.get('seedSql') || formData.get('seed_sql') || '') as string);
      expectedSql = ((formData.get('expectedSql') || formData.get('expected_sql') || '') as string);
      userSql = ((formData.get('userSql') || formData.get('user_sql') || formData.get('sql') || '') as string);
    }

    if (!userSql || !userSql.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query SQL siswa wajib diisi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch lesson details from DB if lessonId is provided
    if (lessonId && (!seedSql || !expectedSql)) {
      const lessonRes = await query(
        'SELECT seed_sql, expected_sql FROM sql_lessons WHERE id = $1',
        [lessonId]
      );
      if (lessonRes.rows.length > 0) {
        if (!seedSql) seedSql = lessonRes.rows[0].seed_sql || '';
        if (!expectedSql) expectedSql = lessonRes.rows[0].expected_sql || '';
      }
    }

    if (!expectedSql || !expectedSql.trim()) {
      return new Response(
        JSON.stringify({ error: 'Pelajaran atau Expected SQL tidak ditemukan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Evaluate solution using sqlEvaluator
    const evaluation = await evaluateSolution(seedSql, expectedSql, userSql);

    // Check user authentication via session cookie
    const sessionId = cookies.get('session_id')?.value;
    const user = sessionId ? await getSessionUser(sessionId) : null;

    let saved = false;

    // Save progress if passed and user is logged in
    if (user && evaluation.passed && lessonId) {
      try {
        await query(
          `INSERT INTO user_progress (user_id, lesson_id, status, submitted_code, completed_at)
           VALUES ($1, $2, 'completed', $3, NOW())
           ON CONFLICT (user_id, lesson_id)
           DO UPDATE SET status = 'completed', submitted_code = EXCLUDED.submitted_code, completed_at = NOW()`,
          [user.id, lessonId, userSql]
        );
        saved = true;
      } catch (dbErr) {
        console.error('Failed to save user progress:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        ...evaluation,
        authenticated: !!user,
        saved,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Evaluate SQL API Error:', err);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan pada server saat mengevaluasi SQL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
