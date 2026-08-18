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
  { id: 55, score: 79, // 22+19+20+18
    feedback: 'Bagus, Gina! Dekomposisi 4 modul (pemesanan, katalog, antrean dapur FIFO, riwayat & koreksi) sudah terstruktur dan abstraksi kept/ignored-mu tepat. Saran perbaikan: (1) beri contoh penerapan Stack (LIFO) yang konkret, mis. fitur undo pesanan terakhir; (2) lengkapi pseudocode dengan percabangan IF-THEN-ELSE (mis. validasi pembayaran berhasil/gagal); (3) rapikan beberapa teks yang typo agar mudah dibaca. Semangat! (Skor: 79/100)' },
  { id: 56, score: 82, // 23+20+21+18
    feedback: 'Kerja rapi, Sri Fitri! Dekomposisi 4 modul dan abstraksi data penting/diabaikan kamu tertata bersih. Queue (FIFO) untuk urutan pelayanan sudah benar. Saran: (1) tuliskan penerapan Stack (LIFO) yang konkret seperti undo/riwayat penyesuaian; (2) kembangkan pseudocode dengan cabang IF-THEN-ELSE pada validasi pembayaran. Pertahankan kerapianmu! (Skor: 82/100)' },
  { id: 57, score: 76, // 22+16+14+24
    feedback: 'Rido, pseudocode modularmu adalah yang terbaik di kelas — memakai PROSEDUR terpisah dengan IF-MAKA-LAINNYA dan validasi pembayaran, sangat rapi! Namun ada 1 kesalahan penting yang menurunkan nilai: pada ABSTRAKSI, "Harga" kamu masukkan ke data DIABAIKAN, padahal harga adalah DATA PENTING inti transaksi kiosk. Perbaiki juga Pengenalan Pola agar menggambarkan reusable logic (mis. fungsi login/pencarian terpusat), bukan sekadar ketergantungan antar modul. Perbaiki abstraksi itu dan nilaimu akan melonjak. (Skor: 76/100)' },
  { id: 58, score: 83, // 23+21+22+17
    feedback: 'Sangat baik, Anita! Dekomposisi 4 modul e-kantin lengkap, pola solusimu implementatif (fungsi cek stok reusable + status pesanan auto-urut), dan abstraksi ignored-mu sangat tajam. Satu hal untuk ditingkatkan: pseudocode-mu masih garis besar 5 langkah — kembangkan menjadi alur detail dengan percabangan IF-THEN-ELSE (mis. validasi saldo/stok) agar logika sistemnya utuh. Bagus sekali! (Skor: 83/100)' },
  { id: 59, score: 83, // 23+21+22+17
    feedback: 'Sangat baik, Shipa! Dekomposisi 4 modul dan pola solusi (cek stok reusable + status pesanan auto-urut) sudah konkret, abstraksi entitasnya juga lengkap. Saran peningkatan: pseudocode masih ringkas 5 langkah — kembangkan menjadi alur bercabang IF-THEN-ELSE (validasi pembayaran/stok) agar makin lengkap. Pertahankan! (Skor: 83/100)' },
  { id: 60, score: 86, // 23+21+22+20
    feedback: 'Keren, Abdul Aziz! Dekomposisi 4 modul (menu, POS, antrean dapur, stok & riwayat) dan abstraksi kept-nya sangat lengkap, pseudocode-mu pun sudah punya percabangan undo & validasi pembayaran. Koreksi penting: definisi STACK yang kamu tulis ("pesanan masuk awal diproses dulu") itu justru prinsip Queue (FIFO), bukan Stack. Stack = LIFO, contoh tepatnya fitur undo transaksi terakhir. Perbaiki konsep ini ya. (Skor: 86/100)' },
  { id: 61, score: 90, // 22+21+23+24
    feedback: 'Luar biasa, Fikri! Keempat pilar kamu kuat dan konsisten. Keunggulan utamamu ada pada pseudocode yang sangat lengkap: memakai StackUndo, percabangan IF-MAKA-LAINNYA berlapis untuk undo dan validasi pembayaran, lalu enqueue ke Antrean Dapur. Queue & Stack diterapkan tepat. Saran kecil: rapikan penomoran langkah (THEN/ELSE sebaiknya bukan nomor urut). Pertahankan prestasi ini! (Skor: 90/100)' },
  { id: 62, score: 78, // 22+21+22+13
    feedback: 'Nugraha, dekomposisi, pengenalan pola, dan abstraksi kamu solid dan lengkap — deklarasi tipe data di pseudocode juga sudah rapi (termasuk Antrean Dapur: Queue). Namun pseudocode-mu BERHENTI di bagian deklarasi dan belum ada ALUR PROSES-nya. Ini yang paling menurunkan nilai. Lengkapi langkah prosesnya (input pesanan, hitung total, IF pembayaran valid THEN enqueue ke antrean dapur ELSE tolak) agar poin Pilar Algoritma-mu utuh. (Skor: 78/100)' },
  { id: 63, score: 86, // 22+21+22+21
    feedback: 'Sangat baik, Fahmida! Pengenalan polamu paling kontekstual — berangkat dari masalah nyata siswa (antri lama → pre-order jadwal; bingung budget → filter kategori harga). Abstraksi dan pseudocode ber-IF-THEN-ELSE (cek stok → bayar/notifikasi) juga tepat. Saran: cermati pilihan Binary Search — algoritma ini menuntut data sudah terurut lebih dulu, jadi pastikan konteksnya sesuai. Kerja yang matang! (Skor: 86/100)' },
  { id: 64, score: 82, // 20+19+21+22
    feedback: 'Bagus, Dhapin! Pseudocode-mu sudah lengkap dengan IF-THEN-ELSE (cek pembayaran ≥ total → simpan & masuk Queue, else tolak) dan Queue/Stack diterapkan benar. Untuk peningkatan: perdalam deskripsi fungsi tiap modul di dekomposisi (masih singkat) dan pertajam rincian solusi pada Pengenalan Pola. Terus tingkatkan! (Skor: 82/100)' },
  { id: 65, score: 81, // 22+20+20+19
    feedback: 'Bagus, Neng Melani! Dekomposisi 4 modul dengan antrean dapur FIFO jelas, dan Stack (undo pesanan terakhir) sudah kamu terapkan dengan benar. Saran: (1) tambahkan percabangan IF-THEN-ELSE pada pseudocode (mis. validasi pembayaran/stok); (2) pada abstraksi, data yang diabaikan jangan hanya seputar tampilan UI — pertimbangkan juga data non-transaksi lain. Semangat! (Skor: 81/100)' },
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
