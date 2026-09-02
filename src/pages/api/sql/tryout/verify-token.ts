import type { APIRoute } from 'astro';
import { query } from '../../../../lib/db';

const VALID_DEFAULT_TOKENS = [
  'TRYOUTSQL2026',
  'SQL2026',
  'TRYOUT-SQL-2026',
  'SMK-SQL-2026',
  'TRYOUT2026',
  'SQL-SMK'
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const token = (body.token || '').trim().toUpperCase();

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Token ujian tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check against system_settings in DB
    let isDbTokenValid = false;
    try {
      const tokenRes = await query(
        "SELECT setting_value FROM system_settings WHERE setting_key = 'sql_tryout_token'"
      );
      if (tokenRes.rows.length > 0) {
        const dbToken = (tokenRes.rows[0].setting_value || '').trim().toUpperCase();
        if (dbToken && dbToken === token) {
          isDbTokenValid = true;
        }
      }
    } catch (e) {
      console.warn('Could not query system_settings for token:', e);
    }

    const isValid = isDbTokenValid || VALID_DEFAULT_TOKENS.includes(token);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token ujian yang Anda masukkan tidak valid. Silakan periksa kembali atau minta token aktif ke Guru Pengampu.'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        token,
        message: 'Token ujian berhasil diverifikasi! Selamat mengerjakan Try Out SQL.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error in verify-token:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Terjadi kesalahan sistem saat memvalidasi token.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
