import { query } from '../src/lib/db.ts';

async function main() {
  console.log('--- LKPD 1 Submissions (lkpd_submissions) ---');
  const lkpd1Res = await query(`
    SELECT s.id, s.user_id, u.name, u.email, s.case_study, s.score, s.feedback, s.updated_at
    FROM lkpd_submissions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.updated_at DESC
  `);
  console.log(`Total LKPD 1 submissions: ${lkpd1Res.rows.length}`);
  const ungraded1 = lkpd1Res.rows.filter(r => r.score === null);
  console.log(`Ungraded LKPD 1: ${ungraded1.length}`);
  for (const r of lkpd1Res.rows) {
    console.log(`- [LKPD 1] ID: ${r.id} | Name: ${r.name} (${r.email}) | Case: ${r.case_study} | Score: ${r.score ?? 'UNGRADED'} | Updated: ${r.updated_at}`);
  }

  console.log('\n--- LKPD 2 Submissions (lkpd_flowchart_submissions) ---');
  const lkpd2Res = await query(`
    SELECT s.id, s.user_id, u.name, u.email, s.case_study, s.score, s.feedback, s.updated_at
    FROM lkpd_flowchart_submissions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.updated_at DESC
  `);
  console.log(`Total LKPD 2 submissions: ${lkpd2Res.rows.length}`);
  const ungraded2 = lkpd2Res.rows.filter(r => r.score === null);
  console.log(`Ungraded LKPD 2: ${ungraded2.length}`);
  for (const r of lkpd2Res.rows) {
    console.log(`- [LKPD 2] ID: ${r.id} | Name: ${r.name} (${r.email}) | Case: ${r.case_study} | Score: ${r.score ?? 'UNGRADED'} | Updated: ${r.updated_at}`);
  }
}

main().catch(console.error);
