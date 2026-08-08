import type { APIRoute } from 'astro';
import { getSessionUser, createSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let className = '';
    let userId: number | null = null;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      className = body.className?.trim() || body.class_name?.trim() || '';
      if (body.userId) userId = Number(body.userId);
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      className = (formData.get('className') as string || formData.get('class_name') as string || '').trim();
      const uid = formData.get('userId');
      if (uid) userId = Number(uid);
    }

    const sessionId = cookies.get('session_id')?.value;
    const sessionUser = await getSessionUser(sessionId);

    let targetUserId = sessionUser ? sessionUser.id : userId;

    if (!targetUserId || isNaN(targetUserId)) {
      return new Response(
        JSON.stringify({ error: 'Pengguna tidak terautentikasi atau ID pengguna tidak valid.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!className) {
      return new Response(
        JSON.stringify({ error: 'Identitas kelas wajib diisi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user exists in database
    const userRes = await query('SELECT id FROM users WHERE id = $1', [targetUserId]);
    if (userRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Pengguna tidak ditemukan.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update class_name
    await query('UPDATE users SET class_name = $1 WHERE id = $2', [className, targetUserId]);

    // If user wasn't already logged in via session cookie, create session & set cookie
    if (!sessionId || !sessionUser) {
      const newSessionId = await createSession(targetUserId);
      cookies.set('session_id', newSessionId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Identitas Kelas berhasil disimpan!',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Update Class API Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Terjadi kesalahan pada server saat mengupdate kelas.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
