import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

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

    const body = await request.json();
    const {
      caseStudyId,
      teamName,
      teamMembers,
      decomposition,
      pattern,
      abstraction,
      algorithm
    } = body;

    if (!caseStudyId) {
      return new Response(JSON.stringify({ error: 'Studi kasus wajib dipilih.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check existing submission
    const existing = await query(
      `SELECT id FROM lkpd_submissions WHERE user_id = $1 AND case_study_id = $2`,
      [user.id, caseStudyId]
    );

    let result;
    if (existing.rows && existing.rows.length > 0) {
      result = await query(
        `UPDATE lkpd_submissions 
         SET team_name = $1, team_members = $2, decomposition_json = $3, pattern_json = $4, abstraction_json = $5, algorithm_json = $6, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7 AND case_study_id = $8
         RETURNING id`,
        [
          teamName || '',
          JSON.stringify(teamMembers || []),
          JSON.stringify(decomposition || []),
          JSON.stringify(pattern || []),
          JSON.stringify(abstraction || {}),
          JSON.stringify(algorithm || {}),
          user.id,
          caseStudyId
        ]
      );
    } else {
      result = await query(
        `INSERT INTO lkpd_submissions (user_id, case_study_id, team_name, team_members, decomposition_json, pattern_json, abstraction_json, algorithm_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          user.id,
          caseStudyId,
          teamName || '',
          JSON.stringify(teamMembers || []),
          JSON.stringify(decomposition || []),
          JSON.stringify(pattern || []),
          JSON.stringify(abstraction || {}),
          JSON.stringify(algorithm || {})
        ]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Tugas LKPD berhasil dikirim ke LMS Guru!',
      submissionId: result.rows[0].id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error submitting LKPD:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan LKPD: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
