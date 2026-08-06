import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    const user = await getSessionUser(sessionId);

    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('suhendar'));

    if (!user || !isTeacherOrAdmin) {
      return new Response(JSON.stringify({ error: 'Akses ditolak. Hanya Guru / Admin yang dapat mengatur tenggat waktu.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { deadline } = await request.json();

    // Upsert deadline setting in Postgres
    await query(
      `INSERT INTO system_settings (setting_key, setting_value, updated_at)
       VALUES ('lkpd_deadline', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (setting_key) 
       DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP`,
      [deadline || '']
    );

    return new Response(JSON.stringify({
      success: true,
      message: deadline ? 'Tenggat waktu pengumpulan LKPD berhasil disimpan!' : 'Tenggat waktu pengumpulan LKPD berhasil dihapus!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error setting LKPD deadline:', error);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan tenggat waktu: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
