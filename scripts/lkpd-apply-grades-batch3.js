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

// Penilaian objektif per RUBRIK_PENILAIAN_LKPD1.md (Dekomposisi/Pola/Abstraksi/Algoritma, maks 25 tiap pilar)
const grades = [
  { id: 66, score: 80, // 21+21+19+19
    feedback: 'Bagus, Puspita! Dekomposisi 4 modul e-kantin dan pengenalan polamu berangkat dari masalah nyata siswa (antri lama → pre-order; bingung budget → filter kategori/harga) — ini pendekatan yang tepat. Queue (FIFO) dan Stack (tombol batal, LIFO) juga sudah benar. Saran: (1) perinci data yang DIABAIKAN, jangan berhenti di "dll"; (2) rapikan cabang ELSE pada pseudocode agar alur "stok habis" jelas terpisah. Semangat! (Skor: 80/100)' },
  { id: 67, score: 83, // 22+21+21+19
    feedback: 'Kreatif, Lutpi! Kamu memilih studi kasus custom (sistem manajemen proyek software tim) dan modul-modulnya relevan. Penerapan Queue pada antrean penggabungan kode (FIFO) dan Stack pada riwayat versi/undo (LIFO) sangat tepat dan kontekstual. Catatan penting: pseudocode-mu masih berjudul "Proses_Pemesanan_Kantin" (template bawaan) — tidak sesuai proyekmu. Tulis ulang pseudocode sesuai alur proyek software (mis. submit tugas → cek selesai → gabung/merge), dan nilaimu akan naik. (Skor: 83/100)' },
  { id: 68, score: 69, // 21+20+10+18
    feedback: 'Ulpi, dekomposisi 4 modul dan pengenalan polamu (pre-order, update stok real-time) sudah bagus dan problem-driven. Tapi ada 1 kesalahan besar yang sangat menurunkan nilai: kolom ABSTRAKSI kamu TERTUKAR. Daftar ID siswa, nama, harga, stok, ID pesanan, status pembayaran itu adalah DATA PENTING (kept), bukan data yang diabaikan. Tukar posisi kept ↔ ignored, dan nilaimu akan langsung melonjak. Perbaiki ya! (Skor: 69/100)' },
  { id: 69, score: 51, // 19+15+10+7
    feedback: 'Azriel, ide sistem Pemilu OSIS (e-voting) kamu menarik dan dekomposisi 4 modulnya (manajemen kandidat, autentikasi, penghitungan suara, laporan) menunjukkan pemahaman yang baik. Namun ada beberapa hal penting yang harus diperbaiki: (1) ABSTRAKSI keliru — isi "kept" dengan DATA (ID pemilih, nama, waktu vote), bukan aturan database; (2) PSEUDOCODE belum ada — tuliskan langkah algoritma nyata dengan IF-THEN-ELSE (mis. cek sudah vote atau belum); (3) Queue/Stack tidak nyambung (kamu menyebut "pasien", padahal ini sistem pemilu); (4) rapikan penulisan agar mudah dibaca. Dasarnya sudah ada, ayo revisi supaya lengkap. (Skor: 51/100)' },
  { id: 70, score: 89, // 22+21+22+24
    feedback: 'Luar biasa, Fahir! Pseudocode-mu yang terbaik di kelompok ini — kamu bahkan menerapkan Queue Prioritas (lansia/ibu hamil ke depan antrean), percabangan ELSEIF untuk jadwal dokter tutup, perhitungan estimasi waktu, sampai notifikasi nomor antrean. Dekomposisi, pengenalan pola (login multi-role & pencarian terpusat), dan abstraksi kept/ignored-mu juga tajam. Saran kecil: rapikan ejaan istilah teknis (pasien, final, dll). Pertahankan kualitas ini! (Skor: 89/100)' },
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
    console.log(res.rows.length > 0 ? `OK #${res.rows[0].id} -> skor ${res.rows[0].score}` : `SKIP #${g.id} (tidak ditemukan)`);
  }
  await db.end();
  process.exit(0);
}

apply().catch(err => { console.error('Apply failed:', err.message); process.exit(1); });
