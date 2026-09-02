import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';
import { sqlTryoutQuestions } from '../../../../data/sqlTryoutQuestions';

const KKM_THRESHOLD = 75;

const VALID_DEFAULT_TOKENS = [
  'TRYOUTSQL2026',
  'SQL2026',
  'TRYOUT-SQL-2026',
  'SMK-SQL-2026',
  'TRYOUT2026',
  'SQL-SMK'
];

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Sesi Anda telah berakhir. Silakan login terlebih dahulu.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { token, answers, durationSeconds = 0 } = body;

    const cleanToken = (token || '').trim().toUpperCase();

    // Verify token
    let isDbTokenValid = false;
    try {
      const tokenRes = await query(
        "SELECT setting_value FROM system_settings WHERE setting_key = 'sql_tryout_token'"
      );
      if (tokenRes.rows.length > 0) {
        const dbToken = (tokenRes.rows[0].setting_value || '').trim().toUpperCase();
        if (dbToken && dbToken === cleanToken) {
          isDbTokenValid = true;
        }
      }
    } catch (e) {
      console.warn('Could not query system_settings for token:', e);
    }

    if (!isDbTokenValid && !VALID_DEFAULT_TOKENS.includes(cleanToken)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token ujian tidak valid.' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const studentAnswersMap: Record<number, string> = {};
    if (Array.isArray(answers)) {
      for (const ans of answers) {
        if (ans && ans.questionId) {
          studentAnswersMap[ans.questionId] = (ans.selectedAnswer || '').trim().toUpperCase();
        }
      }
    } else if (typeof answers === 'object' && answers !== null) {
      for (const [qId, ans] of Object.entries(answers)) {
        studentAnswersMap[Number(qId)] = String(ans).trim().toUpperCase();
      }
    }

    let correctCount = 0;
    const totalQuestions = sqlTryoutQuestions.length;

    const reviewItems = sqlTryoutQuestions.map((q) => {
      const selected = studentAnswersMap[q.id] || null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        category: q.category,
        question: q.question,
        codeSnippet: q.codeSnippet || null,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = score >= KKM_THRESHOLD;

    // Save attempt to PostgreSQL database
    try {
      await query(
        `INSERT INTO sql_tryout_submissions 
          (user_id, token_used, total_questions, correct_answers, score, duration_seconds, answers_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user.id,
          cleanToken,
          totalQuestions,
          correctCount,
          score,
          durationSeconds,
          JSON.stringify(studentAnswersMap)
        ]
      );

      // Auto enroll to SQL course
      await query(
        `INSERT INTO course_enrollments (user_id, course_id)
         VALUES ($1, 'sql')
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [user.id]
      );
    } catch (dbErr) {
      console.error('Failed to save tryout submission to DB:', dbErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        userName: user.name,
        userEmail: user.email,
        score,
        correctCount,
        wrongCount: totalQuestions - correctCount,
        totalQuestions,
        isPassed,
        kkm: KKM_THRESHOLD,
        durationSeconds,
        review: reviewItems
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error submitting tryout:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Terjadi kegagalan saat memproses hasil ujian.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
