import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const db = createPool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL });

// Skor + umpan balik hasil penilaian objektif per RUBRIK_PENILAIAN_LKPD1.md
// (Dekomposisi/Pola/Abstraksi/Algoritma masing-masing maks 25 poin)
const grades = [
  {
    id: 51,
    score: 93, // 24 + 23 + 24 + 22
    feedback:
      'Luar biasa, Rafka! Analisis 4 Pilar Berpikir Komputasional untuk SmartKlinik sangat matang dan terstruktur. ' +
      'Keunggulan utamamu ada pada dekomposisi 4 modul yang spesifik (Pendaftaran & Antrean, Loket, Poliklinik, Pembayaran & Farmasi) dan abstraksi kept/ignored yang sangat tajam. ' +
      'Penerapan Queue pada pemanggilan antrean poli (FIFO) dan Stack pada undo pencatatan rekam medis (LIFO) tepat sasaran. ' +
      'Saran: lengkapi pseudocode dengan percabangan IF-THEN-ELSE (mis. validasi ketersediaan poli/dokter) agar alur logikanya makin lengkap. Pertahankan! (Skor: 93/100)'
  },
  {
    id: 52,
    score: 72, // 18 + 17 + 17 + 20
    feedback:
      'Kerja bagus, Geriel! Pseudocode 18-langkah kamu runtut dan sudah menerapkan Queue (FIFO) dengan benar pada alur antrean pasien — ini poin terkuatmu. ' +
      'Untuk peningkatan: (1) pada dekomposisi, modul ke-4 kolom fungsinya keliru terisi penjelasan pola antrean, isi dengan fungsi teknis modul farmasi/resep; ' +
      '(2) selaraskan nama pola dengan solusinya di Pengenalan Pola; ' +
      '(3) pada abstraksi, "detail pembayaran" dan "riwayat penyakit" justru DATA PENTING sistem klinik, jangan diabaikan. ' +
      'Perbaiki tiga hal ini dan nilaimu akan melonjak. (Skor: 72/100)'
  },
  {
    id: 53,
    score: 89, // 23 + 22 + 23 + 21
    feedback:
      'Sangat baik, Gilang! Dekomposisi 4 modul SmartKlinik-mu jelas dan pola solusi terpusat (login multi-role pasien/dokter/admin serta cek status antrean satu sumber) menunjukkan pemahaman reusable logic yang matang. ' +
      'Abstraksi kept/ignored sudah tepat, dan pseudocode-mu sudah memakai IF-THEN untuk cek data pasien lalu enqueue ke Queue antrean. ' +
      'Saran: kembangkan pseudocode dengan cabang ELSE (mis. jika kuota poli penuh) agar makin lengkap. Kerja yang rapi! (Skor: 89/100)'
  },
  {
    id: 54,
    score: 68, // 16 + 16 + 19 + 17
    feedback:
      'Terima kasih atas usahamu, Akmal! Kontenmu untuk E-Kantin kaya dan abstraksi data penting/diabaikan (ID Transaksi, Nama, Total Bayar vs warna baju/sepatu) sudah benar. ' +
      'Untuk peningkatan: (1) pada dekomposisi, kolom NAMA MODUL diisi dengan nama modul software (mis. "Modul Pemesanan", "Modul Pembayaran"), bukan daftar menu/deskripsi; ' +
      '(2) di Pengenalan Pola, solusi pola login jangan berupa potongan HTML — tuliskan sebagai fungsi validasi terpusat yang bisa dipakai ulang; ' +
      '(3) contohkan Stack (LIFO) yang benar, mis. fitur batal/undo pesanan terakhir. Pseudocode-mu sudah punya IF-ELSE dan Queue dapur, itu bagus. Semangat memperbaiki! (Skor: 68/100)'
  }
];

async function apply() {
  for (const g of grades) {
    const res = await db.query(
      `UPDATE lkpd_submissions
       SET score = $1, teacher_feedback = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, score;`,
      [g.score, g.feedback, g.id]
    );
    if (res.rows.length > 0) {
      console.log(`OK #${res.rows[0].id} -> skor ${res.rows[0].score}`);
    } else {
      console.log(`SKIP #${g.id} (tidak ditemukan)`);
    }
  }
  await db.end();
  process.exit(0);
}

apply().catch(err => { console.error('Apply failed:', err.message); process.exit(1); });
