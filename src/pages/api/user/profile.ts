import type { APIRoute } from 'astro';
import { getSessionUser, hashPassword } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Sesi login tidak valid. Silakan login kembali.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { name, class_name, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nama lengkap tidak boleh kosong.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const trimmedName = name.trim();
    const trimmedClassName = typeof class_name === 'string' ? class_name.trim() : '';

    if (password && typeof password === 'string' && password.trim().length > 0) {
      if (password.length < 6) {
        return new Response(
          JSON.stringify({ error: 'Password minimal 6 karakter.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const newHash = await hashPassword(password);
      await query(
        'UPDATE users SET name = $1, class_name = $2, password_hash = $3 WHERE id = $4',
        [trimmedName, trimmedClassName, newHash, user.id]
      );
    } else {
      await query(
        'UPDATE users SET name = $1, class_name = $2 WHERE id = $3',
        [trimmedName, trimmedClassName, user.id]
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profil berhasil diperbarui!',
        user: {
          name: trimmedName,
          class_name: trimmedClassName
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Error updating user profile:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Gagal memperbarui profil.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
