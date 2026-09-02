import fs from 'fs';
import { createPool } from '@vercel/postgres';

function getEnvUrl() {
  const paths = ['.env.local', '.vercel/.env.production.local'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      for (const line of content.split('\n')) {
        if (line.startsWith('POSTGRES_URL=') || line.startsWith('DATABASE_URL=')) {
          const raw = line.split('=')[1]?.trim();
          if (raw) {
            return raw.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
}

function parseJson(str: string, fallback: any) {
  try {
    if (!str) return fallback;
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (e) {
    return fallback;
  }
}

function evaluateLKPD1(item: any) {
  const name = item.student_name || item.team_name || 'Siswa';
  const deco = parseJson(item.decomposition_json, []);
  const pattern = parseJson(item.pattern_json, []);
  const abst = parseJson(item.abstraction_json, {});
  const algo = parseJson(item.algorithm_json, {});

  let scoreDeco = 0;
  let scorePattern = 0;
  let scoreAbst = 0;
  let scoreAlgo = 0;

  // 1. Decomposition (Max 25)
  if (Array.isArray(deco)) {
    const validMods = deco.filter((m: any) => (m.mod && m.mod.trim().length > 3) && (m.func && m.func.trim().length > 5));
    if (validMods.length >= 4) scoreDeco = 25;
    else if (validMods.length === 3) scoreDeco = 22;
    else if (validMods.length === 2) scoreDeco = 18;
    else if (validMods.length === 1) scoreDeco = 12;
    else scoreDeco = 5;
  }

  // 2. Pattern Recognition (Max 25)
  if (Array.isArray(pattern)) {
    const validPats = pattern.filter((p: any) => (p.name && p.name.trim().length > 3) && (p.sol && p.sol.trim().length > 5));
    if (validPats.length >= 2) scorePattern = 25;
    else if (validPats.length === 1) scorePattern = 18;
    else scorePattern = 5;
  }

  // 3. Abstraction (Max 25)
  const kept = (abst.kept || '').trim();
  const ignored = (abst.ignored || '').trim();
  if (kept.length > 15 && ignored.length > 15) scoreAbst = 25;
  else if (kept.length > 5 && ignored.length > 5) scoreAbst = 20;
  else if (kept.length > 5 || ignored.length > 5) scoreAbst = 14;
  else scoreAbst = 5;

  // 4. Algorithm & Pseudocode (Max 25)
  const pseudo = (algo.pseudocode || '').trim();
  const hasSearch = Boolean(algo.search && algo.search.trim());
  const hasSort = Boolean(algo.sort && algo.sort.trim());
  const hasQueue = Boolean(algo.queue && algo.queue.trim().length > 10);
  const hasStack = Boolean(algo.stack && algo.stack.trim().length > 10);

  let algoBase = 0;
  if (hasSearch && hasSort) algoBase += 6;
  else if (hasSearch || hasSort) algoBase += 3;
  if (hasQueue) algoBase += 4;
  if (hasStack) algoBase += 4;

  if (pseudo.length > 100 && (pseudo.toUpperCase().includes('IF') || pseudo.toUpperCase().includes('JIKA'))) {
    algoBase += 11;
  } else if (pseudo.length > 40) {
    algoBase += 8;
  } else if (pseudo.length > 0) {
    algoBase += 4;
  }

  scoreAlgo = Math.min(25, algoBase);

  const totalScore = Math.min(100, Math.max(50, scoreDeco + scorePattern + scoreAbst + scoreAlgo));

  let feedback = '';
  if (totalScore >= 95) {
    feedback = `Luar biasa ${name}! Analisis 4 Pilar Berpikir Komputasional sangat lengkap, mendalam, dan terstruktur rapi. Pemisahan modul, penentuan data esensial, dan rancangan algoritma dieksekusi dengan standar tinggi. Pertahankan prestasi gemilang ini!`;
  } else if (totalScore >= 85) {
    feedback = `Kerja yang sangat bagus ${name}! Konsep 4 pilar telah dipahami dengan baik. Dekomposisi dan abstraksi data tersusun runtut. Tingkatkan kedalaman logika pada perancangan algoritma dan pseudocode untuk hasil yang semakin sempurna.`;
  } else if (totalScore >= 75) {
    feedback = `Cukup baik ${name}! Tugas telah memenuhi KKM (75). Analisis dasar sudah tepat, namun lengkapi deskripsi fungsi tiap modul serta perjelas notasi pseudocode agar alur program lebih mudah dieksekusi oleh komputer.`;
  } else {
    feedback = `Perlu perbaikan ${name}. Pastikan untuk melengkapi seluruh 4 pilar, terutama deskripsi fungsi modul dekomposisi dan penulisan pseudocode yang terstruktur. Silakan perbaiki sesuai panduan materi.`;
  }

  return { id: item.id, name, totalScore, feedback };
}

function evaluateLKPD2(item: any) {
  const name = item.student_name || item.team_name || 'Siswa';
  const flow = parseJson(item.flowchart_json, []);
  const pseudo = (item.pseudocode_text || '').trim();

  let scoreFlow = 0;
  let scorePseudo = 0;

  // 1. Flowchart (Max 50)
  if (Array.isArray(flow)) {
    const nodeCount = flow.length;
    const hasTerminal = flow.some((n: any) => n.shape === 'terminal');
    const hasIo = flow.some((n: any) => n.shape === 'io');
    const hasProcess = flow.some((n: any) => n.shape === 'process');
    const hasDecision = flow.some((n: any) => n.shape === 'decision');

    let shapeTypesCount = (hasTerminal ? 1 : 0) + (hasIo ? 1 : 0) + (hasProcess ? 1 : 0) + (hasDecision ? 1 : 0);

    if (nodeCount >= 7 && shapeTypesCount >= 3) scoreFlow = 50;
    else if (nodeCount >= 5 && shapeTypesCount >= 3) scoreFlow = 45;
    else if (nodeCount >= 4) scoreFlow = 38;
    else if (nodeCount >= 2) scoreFlow = 28;
    else scoreFlow = 15;
  }

  // 2. Pseudocode (Max 50)
  const pUpper = pseudo.toUpperCase();
  const hasCond = pUpper.includes('IF') || pUpper.includes('JIKA');
  const hasLoop = pUpper.includes('WHILE') || pUpper.includes('FOR') || pUpper.includes('SELAMA') || pUpper.includes('UNTUK');
  const hasKeywords = (pUpper.includes('START') || pUpper.includes('MULAI')) && (pUpper.includes('END') || pUpper.includes('SELESAI'));

  if (pseudo.length > 120 && hasCond && hasKeywords) scorePseudo = 50;
  else if (pseudo.length > 70 && hasCond) scorePseudo = 44;
  else if (pseudo.length > 40) scorePseudo = 36;
  else if (pseudo.length > 10) scorePseudo = 25;
  else scorePseudo = 10;

  const totalScore = Math.min(100, Math.max(50, scoreFlow + scorePseudo));

  let feedback = '';
  if (totalScore >= 95) {
    feedback = `Sangat memuaskan ${name}! Diagram alir (flowchart) tersusun sangat sistematis dengan simbol ANSI yang tepat, serta pseudocode ditulis dengan struktur logika percabangan yang rapi dan mudah diimplementasikan. Kerja hebat!`;
  } else if (totalScore >= 85) {
    feedback = `Bagus sekali ${name}! Alur logika program sudah runtut dan jelas. Flowchart dan pseudocode saling selaras. Pertahankan pemahaman logika algoritma yang solid ini!`;
  } else if (totalScore >= 75) {
    feedback = `Cukup baik ${name}! Tugas sudah memenuhi KKM (75). Saran: Pada flowchart, pastikan kondisi pada Decision selalu memiliki cabang Ya/Tidak yang spesifik, dan lengkapi blok penanganan kondisi pada pseudocode.`;
  } else {
    feedback = `Perlu latihan lebih lanjut ${name}. Pastikan menggunakan simbol flowchart yang bervariasi (Terminal, Input/Output, Process, Decision) dan susun pseudocode dengan alur yang lengkap.`;
  }

  return { id: item.id, name, totalScore, feedback };
}

async function main() {
  const connStr = getEnvUrl();
  const pool = createPool({ connectionString: connStr });
  const client = await pool.connect();

  try {
    console.log('--- Applying Grades for LKPD 1 ---');
    const res1 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
    `);
    console.log(`Found ${res1.rows.length} LKPD 1 submissions to grade.`);

    for (const row of res1.rows) {
      const evaluation = evaluateLKPD1(row);
      await client.query(`
        UPDATE lkpd_submissions
        SET score = $1, teacher_feedback = $2, updated_at = NOW()
        WHERE id = $3
      `, [evaluation.totalScore, evaluation.feedback, row.id]);
      console.log(`✅ Graded LKPD 1 ID ${row.id} (${evaluation.name}): Score ${evaluation.totalScore}`);
    }

    console.log('\n--- Applying Grades for LKPD 2 ---');
    const res2 = await client.query(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM lkpd_flowchart_submissions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.score IS NULL
    `);
    console.log(`Found ${res2.rows.length} LKPD 2 submissions to grade.`);

    for (const row of res2.rows) {
      const evaluation = evaluateLKPD2(row);
      await client.query(`
        UPDATE lkpd_flowchart_submissions
        SET score = $1, teacher_feedback = $2, updated_at = NOW()
        WHERE id = $3
      `, [evaluation.totalScore, evaluation.feedback, row.id]);
      console.log(`✅ Graded LKPD 2 ID ${row.id} (${evaluation.name}): Score ${evaluation.totalScore}`);
    }

    console.log('\n🎉 ALL GRADES SUCCESSFULLY SAVED TO DATABASE!');
  } finally {
    client.release();
  }
}

main().catch(console.error);
