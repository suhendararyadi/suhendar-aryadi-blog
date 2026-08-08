import type { APIRoute } from 'astro';
import { verifyPassword, createSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let email = '';
    let password = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email?.trim().toLowerCase() || '';
      password = body.password || '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      email = (formData.get('email') as string || '').trim().toLowerCase();
      password = (formData.get('password') as string || '');
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email dan password wajib diisi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const res = await query('SELECT id, name, email, password_hash, role, class_name FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Email atau password salah.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = res.rows[0];
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: 'Email atau password salah.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if ((!user.class_name || user.class_name.trim() === '') && (user.role === 'student' || !user.role)) {
      return new Response(
        JSON.stringify({
          requiresClass: true,
          userId: user.id,
          message: 'Identitas kelas wajib diisi.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sessionId = await createSession(user.id);
    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, class_name: user.class_name }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Login API Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Terjadi kesalahan pada server saat login' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
