import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Sesi tidak valid' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      token = '',
      answersCount = 0,
      currentQuestionIndex = 0,
      doubtCount = 0,
      durationSeconds = 0,
      violationCount = 0,
      isLocked = false,
      lockoutRemaining = 0
    } = body;

    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0].trim() || '127.0.0.1';

    // 1. Check if user already submitted officially
    const subRes = await query(
      'SELECT id, is_disqualified FROM sql_exam_submissions WHERE user_id = $1 LIMIT 1',
      [user.id]
    );

    if (subRes.rows && subRes.rows.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          alreadySubmitted: true,
          isDisqualified: Boolean(subRes.rows[0].is_disqualified)
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Check if admin issued a force unlock for this user
    let forceUnlocked = false;
    const activeRes = await query(
      'SELECT force_unlocked FROM sql_exam_active_sessions WHERE user_id = $1 LIMIT 1',
      [user.id]
    );

    if (activeRes.rows && activeRes.rows.length > 0) {
      forceUnlocked = Boolean(activeRes.rows[0].force_unlocked);
    }

    const effectiveIsLocked = forceUnlocked ? false : Boolean(isLocked);
    const effectiveLockoutRemaining = forceUnlocked ? 0 : Number(lockoutRemaining) || 0;
    const status = effectiveIsLocked ? 'locked' : (Number(violationCount) >= 3 ? 'disqualified' : 'in_progress');

    // 3. Upsert into sql_exam_active_sessions
    await query(
      `INSERT INTO sql_exam_active_sessions 
        (user_id, token_used, answers_count, current_question_index, doubt_count, duration_seconds, violation_count, is_locked, lockout_remaining, force_unlocked, status, user_agent, ip_address, last_heartbeat_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET
        token_used = COALESCE(NULLIF(EXCLUDED.token_used, ''), sql_exam_active_sessions.token_used),
        answers_count = EXCLUDED.answers_count,
        current_question_index = EXCLUDED.current_question_index,
        doubt_count = EXCLUDED.doubt_count,
        duration_seconds = EXCLUDED.duration_seconds,
        violation_count = EXCLUDED.violation_count,
        is_locked = EXCLUDED.is_locked,
        lockout_remaining = EXCLUDED.lockout_remaining,
        force_unlocked = FALSE,
        status = EXCLUDED.status,
        user_agent = EXCLUDED.user_agent,
        ip_address = EXCLUDED.ip_address,
        last_heartbeat_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP`,
      [
        user.id,
        String(token || 'OFFICIAL'),
        Number(answersCount) || 0,
        Number(currentQuestionIndex) || 0,
        Number(doubtCount) || 0,
        Number(durationSeconds) || 0,
        Number(violationCount) || 0,
        effectiveIsLocked,
        effectiveLockoutRemaining,
        status,
        userAgent.substring(0, 500),
        ipAddress.substring(0, 100)
      ]
    );

    return new Response(
      JSON.stringify({
        success: true,
        forceUnlocked,
        isLocked: effectiveIsLocked
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.warn('Silent heartbeat ping warning:', err);
    return new Response(
      JSON.stringify({ success: true, warning: 'Heartbeat recorded locally' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
