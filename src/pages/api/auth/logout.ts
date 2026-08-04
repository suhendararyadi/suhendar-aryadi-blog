import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    if (sessionId) {
      await destroySession(sessionId);
    }
    cookies.delete('session_id', { path: '/' });

    return new Response(
      JSON.stringify({ success: true, message: 'Berhasil keluar' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Logout API Error:', err);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan pada server saat logout' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
