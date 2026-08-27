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

    const body = await request.json();
    const {
      teamName,
      memberUserId,
      memberNameManual,
      projectTitle,
      sqlScriptLink,
      reportPdfLink,
      query1Text,
      query2Text,
      query3Text,
      query4Text,
      query5Text,
      notes
    } = body;

    if (!teamName || !teamName.trim()) {
      return new Response(JSON.stringify({ error: 'Nama Tim / Kelompok wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!sqlScriptLink || !sqlScriptLink.trim()) {
      return new Response(JSON.stringify({ error: 'Tautan (link) berkas skrip .sql wajib dilampirkan.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!query1Text || !query1Text.trim() ||
        !query2Text || !query2Text.trim() ||
        !query3Text || !query3Text.trim() ||
        !query4Text || !query4Text.trim() ||
        !query5Text || !query5Text.trim()) {
      return new Response(JSON.stringify({ error: 'Seluruh 5 Kueri Analitik Bisnis wajib diisi dengan lengkap.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check existing submission for this user
    const existingRes = await query(
      `SELECT id, score FROM sql_project_submissions WHERE user_id = $1`,
      [user.id]
    );

    if (existingRes.rows && existingRes.rows.length > 0) {
      const existing = existingRes.rows[0];
      const existingScore = existing.score !== null ? parseInt(existing.score, 10) : null;

      // Lock if student already achieved KKM (>= 75)
      if (existingScore !== null && existingScore >= KKM_THRESHOLD) {
        return new Response(JSON.stringify({
          error: `Proyek Anda telah dinilai TUNTAS (Nilai: ${existingScore}/100) dan terkunci. Pengiriman ulang hanya diperbolehkan untuk remedial.`
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await query(
        `UPDATE sql_project_submissions
         SET member_user_id = $1,
             member_name_manual = $2,
             team_name = $3,
             project_title = $4,
             sql_script_link = $5,
             report_pdf_link = $6,
             query_1_text = $7,
             query_2_text = $8,
             query_3_text = $9,
             query_4_text = $10,
             query_5_text = $11,
             notes = $12,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $13`,
        [
          memberUserId ? parseInt(memberUserId, 10) : null,
          (memberNameManual || '').trim(),
          teamName.trim(),
          (projectTitle || 'SmartMart POS - Sistem Basis Data Kasir Ritel').trim(),
          sqlScriptLink.trim(),
          (reportPdfLink || '').trim(),
          query1Text.trim(),
          query2Text.trim(),
          query3Text.trim(),
          query4Text.trim(),
          query5Text.trim(),
          (notes || '').trim(),
          existing.id
        ]
      );

      return new Response(JSON.stringify({
        success: true,
        message: 'Pembaruan tugas proyek SQL SmartMart POS berhasil disimpan!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert new submission
    await query(
      `INSERT INTO sql_project_submissions (
        user_id,
        member_user_id,
        member_name_manual,
        team_name,
        project_title,
        sql_script_link,
        report_pdf_link,
        query_1_text,
        query_2_text,
        query_3_text,
        query_4_text,
        query_5_text,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        user.id,
        memberUserId ? parseInt(memberUserId, 10) : null,
        (memberNameManual || '').trim(),
        teamName.trim(),
        (projectTitle || 'SmartMart POS - Sistem Basis Data Kasir Ritel').trim(),
        sqlScriptLink.trim(),
        (reportPdfLink || '').trim(),
        query1Text.trim(),
        query2Text.trim(),
        query3Text.trim(),
        query4Text.trim(),
        query5Text.trim(),
        (notes || '').trim()
      ]
    );

    // Auto enroll in SQL course
    try {
      await query(
        `INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, 'sql') ON CONFLICT (user_id, course_id) DO NOTHING`,
        [user.id]
      );
    } catch (e) {
      console.warn('Enrollment hook error:', e);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Tugas Proyek Basis Data SQL SmartMart POS berhasil dikumpulkan!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error submitting SQL project:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan tugas proyek: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
