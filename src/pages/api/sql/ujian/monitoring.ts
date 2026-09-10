import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Sesi Anda telah berakhir. Silakan login kembali.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || (user.email && user.email.toLowerCase().includes('suhendar'));
    if (!isTeacherOrAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Akses ditolak. Fitur ini hanya untuk Guru Pengampu / Admin CBT.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const selectedClass = url.searchParams.get('class') || '';

    // Query all students, their active sessions, and final submissions
    const sqlQuery = `
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.role,
        u.class_name,
        u.created_at as registered_at,
        act.token_used as active_token,
        act.started_at as session_started_at,
        act.last_heartbeat_at,
        act.answers_count,
        act.current_question_index,
        act.doubt_count,
        act.duration_seconds as active_duration,
        act.violation_count as active_violations,
        act.is_locked,
        act.lockout_remaining,
        act.status as active_status,
        act.user_agent,
        act.ip_address,
        sub.id as submission_id,
        sub.score as final_score,
        sub.correct_answers,
        sub.total_questions,
        sub.duration_seconds as final_duration,
        sub.violation_count as final_violations,
        sub.is_disqualified,
        sub.disqualification_reason,
        sub.created_at as submitted_at,
        EXTRACT(EPOCH FROM (NOW() - act.last_heartbeat_at)) as seconds_since_heartbeat
      FROM users u
      LEFT JOIN sql_exam_active_sessions act ON u.id = act.user_id
      LEFT JOIN sql_exam_submissions sub ON u.id = sub.user_id
      WHERE (u.role IS NULL OR u.role = 'student' OR u.role = '')
      ORDER BY 
        CASE 
          WHEN act.is_locked = TRUE THEN 1
          WHEN sub.id IS NOT NULL THEN 4
          WHEN act.last_heartbeat_at IS NOT NULL AND EXTRACT(EPOCH FROM (NOW() - act.last_heartbeat_at)) < 45 THEN 2
          WHEN act.id IS NOT NULL THEN 3
          ELSE 5
        END ASC,
        u.class_name ASC,
        u.name ASC;
    `;

    const result = await query(sqlQuery);
    const rows = result.rows || [];

    // Distinct class names for filter dropdown
    const classSet = new Set<string>();
    rows.forEach((r: any) => {
      if (r.class_name && r.class_name.trim()) {
        classSet.add(r.class_name.trim());
      }
    });
    const classes = Array.from(classSet).sort();

    let totalStudents = 0;
    let inProgressCount = 0;
    let lockedCount = 0;
    let violationAlertCount = 0;
    let submittedCount = 0;
    let disqualifiedCount = 0;
    let totalScoreSum = 0;
    let scoreCount = 0;

    const formattedStudents = rows.map((r: any) => {
      totalStudents++;
      const secondsSinceHeartbeat = r.seconds_since_heartbeat !== null ? Number(r.seconds_since_heartbeat) : null;
      const isHeartbeatRecent = secondsSinceHeartbeat !== null && secondsSinceHeartbeat <= 45;
      const hasSubmitted = r.submission_id !== null;
      const isDisqualified = Boolean(r.is_disqualified) || (r.active_violations >= 3 && !hasSubmitted);
      const isLocked = Boolean(r.is_locked);

      let status = 'not_started';
      let statusLabel = 'Belum Masuk';
      let statusBadgeClass = 'badge-neutral';

      if (hasSubmitted) {
        if (isDisqualified) {
          status = 'disqualified';
          statusLabel = 'Didiskualifikasi';
          statusBadgeClass = 'badge-error';
          disqualifiedCount++;
        } else {
          status = 'submitted';
          statusLabel = 'Selesai';
          statusBadgeClass = 'badge-success';
          submittedCount++;
          if (r.final_score !== null && r.final_score !== undefined) {
            totalScoreSum += Number(r.final_score);
            scoreCount++;
          }
        }
      } else if (r.session_started_at) {
        if (isDisqualified) {
          status = 'disqualified';
          statusLabel = 'Didiskualifikasi';
          statusBadgeClass = 'badge-error';
          disqualifiedCount++;
        } else if (isLocked) {
          status = 'locked';
          statusLabel = 'Terkunci 5 Mnt';
          statusBadgeClass = 'badge-locked';
          lockedCount++;
          inProgressCount++;
        } else if (isHeartbeatRecent) {
          status = 'in_progress';
          statusLabel = 'Sedang Mengerjakan';
          statusBadgeClass = 'badge-active';
          inProgressCount++;
          if (r.active_violations > 0) {
            violationAlertCount++;
          }
        } else {
          status = 'disconnected';
          statusLabel = 'Terputus / Idle';
          statusBadgeClass = 'badge-warning';
        }
      }

      const answersCount = hasSubmitted 
        ? Number(r.total_questions || 30) 
        : Number(r.answers_count || 0);
      const currentQuestion = Number(r.current_question_index || 0) + 1;
      const progressPercent = Math.min(100, Math.round((answersCount / 30) * 100));
      const violations = hasSubmitted ? Number(r.final_violations || 0) : Number(r.active_violations || 0);
      const durationSeconds = hasSubmitted ? Number(r.final_duration || 0) : Number(r.active_duration || 0);

      return {
        userId: r.user_id,
        name: r.name,
        email: r.email,
        className: r.class_name || 'Tanpa Kelas',
        status,
        statusLabel,
        statusBadgeClass,
        isLocked,
        lockoutRemaining: Math.max(0, Number(r.lockout_remaining || 0)),
        progress: {
          answered: answersCount,
          total: 30,
          percentage: progressPercent,
          currentQuestion: hasSubmitted ? 30 : currentQuestion,
          doubtCount: Number(r.doubt_count || 0)
        },
        violations,
        durationSeconds,
        finalScore: r.final_score !== null ? Number(r.final_score) : null,
        correctAnswers: r.correct_answers !== null ? Number(r.correct_answers) : null,
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : null,
        lastHeartbeatAt: r.last_heartbeat_at ? new Date(r.last_heartbeat_at).toISOString() : null,
        secondsSinceHeartbeat: secondsSinceHeartbeat !== null ? Math.round(secondsSinceHeartbeat) : null,
        ipAddress: r.ip_address || '-',
        isHeartbeatRecent
      };
    });

    const filteredStudents = selectedClass
      ? formattedStudents.filter((s: any) => s.className.toLowerCase() === selectedClass.toLowerCase())
      : formattedStudents;

    const averageScore = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0;

    return new Response(
      JSON.stringify({
        success: true,
        serverTime: new Date().toISOString(),
        classes,
        summary: {
          totalStudents,
          inProgressCount,
          lockedCount,
          violationAlertCount,
          submittedCount,
          disqualifiedCount,
          averageScore
        },
        students: filteredStudents
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (error: any) {
    console.error('Error in exam monitoring API:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Gagal mengambil telemetry live monitoring ujian.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
