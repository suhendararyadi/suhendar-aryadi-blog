import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

const KKM_THRESHOLD = 75;

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
      recipientTo, 
      recipientCc, 
      subjectText, 
      bodyText, 
      attachmentName, 
      attachmentLink 
    } = body;

    if (!caseStudyId) {
      return new Response(JSON.stringify({ error: 'Studi kasus wajib dipilih.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!recipientTo || !recipientTo.trim()) {
      return new Response(JSON.stringify({ error: 'Alamat penerima (To) wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!subjectText || !subjectText.trim()) {
      return new Response(JSON.stringify({ error: 'Subjek email tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!bodyText || !bodyText.trim()) {
      return new Response(JSON.stringify({ error: 'Badan pesan email tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check existing submission
    const existing = await query(
      `SELECT id, score FROM lkpd_email_submissions WHERE user_id = $1 AND case_study_id = $2`,
      [user.id, caseStudyId]
    );

    let result;
    if (existing.rows && existing.rows.length > 0) {
      const currentScore = existing.rows[0].score;

      // Remediation gate: once a submission has reached the KKM, it is locked.
      if (currentScore !== null && currentScore !== undefined && currentScore >= KKM_THRESHOLD) {
        return new Response(JSON.stringify({
          error: `Tugas ini sudah dinilai dan mencapai KKM (${currentScore}/100 ≥ ${KKM_THRESHOLD}). Pengumpulan ulang tidak diperlukan dan telah dikunci oleh sistem.`
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Resubmission accepted: reset grading state
      result = await query(
        `UPDATE lkpd_email_submissions
         SET recipient_to = $1, recipient_cc = $2, subject_text = $3, body_text = $4,
             attachment_name = $5, attachment_link = $6,
             score = NULL, teacher_feedback = '', updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7 AND case_study_id = $8
         RETURNING id`,
        [
          recipientTo.trim(),
          (recipientCc || '').trim(),
          subjectText.trim(),
          bodyText.trim(),
          (attachmentName || '').trim(),
          (attachmentLink || '').trim(),
          user.id,
          caseStudyId
        ]
      );
    } else {
      result = await query(
        `INSERT INTO lkpd_email_submissions (user_id, case_study_id, recipient_to, recipient_cc, subject_text, body_text, attachment_name, attachment_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          user.id,
          caseStudyId,
          recipientTo.trim(),
          (recipientCc || '').trim(),
          subjectText.trim(),
          bodyText.trim(),
          (attachmentName || '').trim(),
          (attachmentLink || '').trim()
        ]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Simulasi Email Profesional berhasil dikirim ke Guru!',
      submissionId: result.rows[0].id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error submitting LKPD Email:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan LKPD: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
