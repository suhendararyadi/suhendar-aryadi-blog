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

    // Check if LKPD assignment deadline has expired
    try {
      const deadlineRes = await query(`SELECT setting_value FROM system_settings WHERE setting_key = 'lkpd_deadline'`);
      if (deadlineRes.rows && deadlineRes.rows.length > 0 && deadlineRes.rows[0].setting_value) {
        const deadlineDate = new Date(deadlineRes.rows[0].setting_value);
        if (new Date() > deadlineDate) {
          return new Response(JSON.stringify({
            error: `Pengumpulan LKPD telah ditutup oleh Guru (Tenggat Waktu: ${deadlineDate.toLocaleString('id-ID')}).`
          }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (e) {
      console.warn('Deadline check error:', e);
    }

    const body = await request.json();
    const {
      caseStudyId,
      teamName,
      teamMembers,
      mailMerge,
      searchOperators,
      reflection
    } = body;

    if (!caseStudyId) {
      return new Response(JSON.stringify({ error: 'Studi kasus wajib dipilih.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check existing submission
    const existing = await query(
      `SELECT id FROM lkpd_tik_submissions WHERE user_id = $1 AND case_study_id = $2`,
      [user.id, caseStudyId]
    );

    let result;
    if (existing.rows && existing.rows.length > 0) {
      result = await query(
        `UPDATE lkpd_tik_submissions 
         SET team_name = $1, team_members = $2, mail_merge_json = $3, search_operators_json = $4, reflection_json = $5, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6 AND case_study_id = $7
         RETURNING id`,
        [
          teamName || '',
          typeof teamMembers === 'string' ? teamMembers : JSON.stringify(teamMembers || []),
          typeof mailMerge === 'string' ? mailMerge : JSON.stringify(mailMerge || {}),
          typeof searchOperators === 'string' ? searchOperators : JSON.stringify(searchOperators || {}),
          typeof reflection === 'string' ? reflection : JSON.stringify(reflection || {}),
          user.id,
          caseStudyId
        ]
      );
    } else {
      result = await query(
        `INSERT INTO lkpd_tik_submissions (user_id, case_study_id, team_name, team_members, mail_merge_json, search_operators_json, reflection_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          user.id,
          caseStudyId,
          teamName || '',
          typeof teamMembers === 'string' ? teamMembers : JSON.stringify(teamMembers || []),
          typeof mailMerge === 'string' ? mailMerge : JSON.stringify(mailMerge || {}),
          typeof searchOperators === 'string' ? searchOperators : JSON.stringify(searchOperators || {}),
          typeof reflection === 'string' ? reflection : JSON.stringify(reflection || {})
        ]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Tugas LKPD TIK berhasil dikirim ke LMS Guru!',
      submissionId: result.rows[0].id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error submitting LKPD TIK:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan LKPD TIK: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
