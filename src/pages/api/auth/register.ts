import type { APIRoute } from 'astro';
import { hashPassword, createSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let name = '';
    let email = '';
    let password = '';
    let className = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = body.name?.trim() || '';
      email = body.email?.trim().toLowerCase() || '';
      password = body.password || '';
      className = body.className?.trim() || body.class_name?.trim() || '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string || '').trim();
      email = (formData.get('email') as string || '').trim().toLowerCase();
      password = (formData.get('password') as string || '');
      className = (formData.get('className') as string || formData.get('class_name') as string || '').trim();
    }

    if (!name || !email || !password || !className) {
      return new Response(
        JSON.stringify({ error: 'Nama, email, password, dan kelas wajib diisi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format email tidak valid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password minimal 6 karakter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Email sudah terdaftar. Silakan login.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await hashPassword(password);
    const insertResult = await query(
      `INSERT INTO users (name, email, password_hash, role, class_name)
       VALUES ($1, $2, $3, 'student', $4)
       RETURNING id, name, email, role, class_name, created_at`,
      [name, email, passwordHash, className]
    );

    const user = insertResult.rows[0];
    const sessionId = await createSession(user.id);

    cookies.set('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          class_name: user.class_name,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Registration API Error:', err);
    const detailedError = err?.message || String(err);
    const stack = err?.stack || '';
    return new Response(
      JSON.stringify({ 
        error: `Database/Server Error: ${detailedError}`,
        details: stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
