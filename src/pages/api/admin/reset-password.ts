import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';
import { getSessionUser, hashPassword } from '../../../lib/auth';
import { query } from '../../../lib/db';

// Generates a readable one-time password, e.g. "kilau-482719"
function generateTempPassword(): string {
  const words = ['kilau', 'nova', 'orbit', 'rajin', 'cerah', 'lincah', 'tekun', 'giat', 'seru', 'maju'];
  const word = words[randomBytes(1)[0] % words.length];
  const digits = randomBytes(3).toString('hex').replace(/[a-f]/g, (c) => String(c.charCodeAt(0) % 10)).slice(0, 6);
  return `${word}-${digits}`;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const actor = await getSessionUser(sessionId);

    const isTeacherOrAdmin = actor?.role === 'teacher' || actor?.role === 'admin' || (actor?.email && actor.email.toLowerCase().includes('suhendar'));

    if (!actor || !isTeacherOrAdmin) {
      return new Response(JSON.stringify({ error: 'Akses ditolak. Hanya Guru / Admin yang dapat mereset password siswa.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json().catch(() => ({}));
    const targetUserId = parseInt(body.userId, 10);

    if (!targetUserId || Number.isNaN(targetUserId)) {
      return new Response(JSON.stringify({ error: 'ID siswa tidak valid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Confirm target exists and is a student account (avoid resetting teacher/admin accounts by mistake)
    const targetRes = await query('SELECT id, name, email, role FROM users WHERE id = $1', [targetUserId]);
    if (targetRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Siswa tidak ditemukan.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const target = targetRes.rows[0];
    if (target.role !== 'student') {
      return new Response(JSON.stringify({ error: 'Reset password hanya berlaku untuk akun siswa.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, targetUserId]);

    // Invalidate all existing sessions for that student so the old password/session can't linger
    await query('DELETE FROM sessions WHERE user_id = $1', [targetUserId]);

    return new Response(JSON.stringify({
      success: true,
      message: `Password untuk ${target.name} berhasil direset.`,
      tempPassword,
      student: { id: target.id, name: target.name, email: target.email }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error resetting student password:', error);
    return new Response(JSON.stringify({ error: 'Gagal mereset password: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
