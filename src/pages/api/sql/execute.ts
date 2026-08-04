import type { APIRoute } from 'astro';
import { executeQuery } from '../../../lib/sqlEvaluator';

export const POST: APIRoute = async ({ request }) => {
  try {
    let seedSql = '';
    let userSql = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      seedSql = body.seedSql || body.seed_sql || '';
      userSql = body.userSql || body.sql || body.user_sql || '';
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      seedSql = ((formData.get('seedSql') || formData.get('seed_sql') || '') as string);
      userSql = ((formData.get('userSql') || formData.get('sql') || formData.get('user_sql') || '') as string);
    }

    if (!userSql || !userSql.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query SQL wajib diisi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await executeQuery(seedSql, userSql);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Execute SQL API Error:', err);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan pada server saat mengeksekusi SQL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
