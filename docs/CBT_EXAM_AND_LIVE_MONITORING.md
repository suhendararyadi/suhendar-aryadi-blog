# Dokumentasi Arsitektur CBT Exam & Live Telemetry Monitoring

Dokumen spesifikasi teknis dan panduan operasional untuk **Ujian Evaluasi Resmi SQL (CBT 30 Soal)** dan **Konsol Pengawas Live Monitoring (CBT Proctor Console)** pada portal pembelajaran RPL SMK: [https://www.suhendararyadi.com](https://www.suhendararyadi.com).

---

## 1. Ikhtisar Sistem (System Overview)

Sistem Computer-Based Test (CBT) ini dirancang untuk menyelenggarakan asesmen sumatif resmi mata pelajaran Basis Data & SQL tingkat SMK RPL. Sistem ini dilengkapi dengan:
1. **Engine Ujian Siswa (`/belajar/sql/ujian`)**: 30 butir soal pilihan ganda 5 opsi, durasi 60 menit dengan countdown timer otomatis, enkripsi kerahasiaan kunci jawaban, dan proteksi anti-cheat 3 tahap.
2. **Konsol Pengawas Dedikasi (`/admin/ujian/monitoring`)**: Tampilan proyektor/layar pengawas dengan metrik real-time, filter rombel, status siswa live, tombol remote unlock, dan ekspor CSV.
3. **Panel Monitoring Terintegrasi (`/belajar/sql/ujian`)**: Panel telemetry mini langsung di halaman ujian bagi Guru/Admin.
4. **Backend Telemetry Fail-Silent (`/api/sql/ujian/heartbeat`, `/api/sql/ujian/monitoring`)**: Komunikasi non-blocking yang menjamin **Zero Disruption** bagi peserta yang sedang aktif mengerjakan soal di lab.

---

## 2. Jaminan Zero Disruption untuk Siswa Aktif

Dalam lingkungan ujian lab sekolah, koneksi internet dan jaringan lokal rentan mengalami lonjakan latensi atau gangguan sesaat. Sistem ini menerapkan 4 pilar Zero Disruption:

1. **Penyimpanan Lokal Persisten (`sessionStorage`)**:
   - Seluruh jawaban siswa dicatat di browser: `sessionStorage.getItem('sql_exam_answers_' + user.id)`.
   - Data lokal ini **tidak pernah dihapus atau direset** oleh server, kecuali saat siswa secara sukarela menekan tombol submit dan menerima konfirmasi sukses.
2. **Fail-Silent Telemetry Ping**:
   - Fungsi `sendHeartbeat()` di client dibungkus dalam `try...catch` senyap. Jika request gagal (timeout, 500, network drop), proses pengerjaan siswa **tidak memunculkan alert, modal error, atau menghentikan timer**.
3. **Skema Database Non-Destruktif**:
   - Data riwayat nilai di `sql_exam_submissions` tidak pernah disentuh secara destruktif oleh migration.
   - Sesi aktif dicatat di tabel baru `sql_exam_active_sessions` dengan `CREATE TABLE IF NOT EXISTS`.
4. **Backward Compatibility Endpoint Submit**:
   - `POST /api/sql/ujian/submit` menerima format payload versi awal maupun terbaru tanpa validasi kaku yang dapat menggagalkan pengiriman nilai.

---

## 3. Protokol Anti-Cheat & 3-Stage Lockout

Sistem mendeteksi berbagai jenis anomali perilaku siswa saat ujian berlangsung:

| Jenis Pelanggaran | Event Listener / Sensor | Keterangan |
|---|---|---|
| **Tab Switching / Minimize** | `document.visibilitychange` | Siswa membuka tab baru atau beralih ke window browser lain |
| **Window Blur** | `window.blur` | Siswa mengklik aplikasi di luar browser (e.g. Chat, Notepad, DevTools) |
| **Keluar Fullscreen** | `document.fullscreenchange` | Siswa menekan ESC atau keluar dari mode layar penuh |
| **Inspect Shortcuts** | `window.keydown` | Memblokir F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+P, Ctrl+S |
| **Context Menu & Clipboard** | `contextmenu`, `copy`, `cut`, `paste` | Memblokir klik kanan dan aksi salin-tempel jawaban |

### Eskalasi Hukuman:
- **Pelanggaran 1**: Dialog peringatan modal ditampilkan. Siswa harus menekan "Saya Mengerti" dan sistem otomatis memicu kembali `requestFullscreen`.
- **Pelanggaran 2**: **Penguncian Layar 5 Menit (5-Minute Lockout)**. Seluruh lembar soal ditutup oleh modal hitung mundur. Soal tidak dapat dibaca atau dijawab hingga waktu 5 menit habis atau dibuka oleh Guru.
- **Pelanggaran 3**: **Diskualifikasi Otomatis**. Nilai disubmit otomatis dengan skor 0 dan status `is_disqualified = TRUE`.

---

## 4. Skema Database (PostgreSQL)

### 4.1 Tabel Riwayat Nilai (`sql_exam_submissions`)
Menyimpan hasil akhir ujian siswa yang telah selesai (atau didiskualifikasi):
```sql
CREATE TABLE IF NOT EXISTS sql_exam_submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token_used VARCHAR(50) NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score INT NOT NULL,
  duration_seconds INT DEFAULT 0,
  answers_json TEXT DEFAULT '{}',
  violation_count INT DEFAULT 0,
  is_disqualified BOOLEAN DEFAULT FALSE,
  disqualification_reason TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Tabel Sesi Telemetry Aktif (`sql_exam_active_sessions`)
Menyimpan telemetry real-time siswa yang sedang aktif di ruang ujian:
```sql
CREATE TABLE IF NOT EXISTS sql_exam_active_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  token_used VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  answers_count INT DEFAULT 0,
  current_question_index INT DEFAULT 0,
  doubt_count INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  violation_count INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  lockout_remaining INT DEFAULT 0,
  force_unlocked BOOLEAN DEFAULT FALSE,
  status VARCHAR(30) DEFAULT 'in_progress',
  user_agent TEXT DEFAULT '',
  ip_address VARCHAR(100) DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Spesifikasi API Endpoint

### 5.1 `POST /api/sql/ujian/heartbeat`
- **Tujuan**: Menerima ping telemetry dari browser siswa setiap 10 detik.
- **Autentikasi**: Cookie sesi siswa aktif.
- **Payload**:
  ```json
  {
    "token": "UJIAN-SQL-2026",
    "answersCount": 18,
    "currentQuestionIndex": 12,
    "doubtCount": 2,
    "durationSeconds": 1420,
    "violationCount": 1,
    "isLocked": false,
    "lockoutRemaining": 0
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "forceUnlocked": false,
    "isLocked": false
  }
  ```

### 5.2 `GET /api/sql/ujian/monitoring`
- **Tujuan**: Mengambil seluruh telemetry siswa, status pengerjaan, dan ringkasan metrik.
- **Autentikasi**: Role `teacher`, `admin`, atau akun pemilik platform.
- **Query Parameter**: `?class=11%20RPL%201` (opsional).
- **Response Summary**:
  - `totalStudents`: Jumlah siswa terdaftar.
  - `inProgressCount`: Siswa online aktif (heartbeat < 45 detik).
  - `lockedCount`: Siswa dalam status lockout 5 menit.
  - `violationAlertCount`: Siswa dengan pelanggaran aktif > 0.
  - `submittedCount`: Siswa yang telah menyelesaikan ujian.
  - `averageScore`: Rata-rata nilai bagi siswa yang sudah submit.

### 5.3 `POST /api/sql/ujian/monitoring-action`
- **Tujuan**: Menjalankan intervensi darurat pengawas ujian.
- **Aksi `unlock`**:
  ```json
  { "action": "unlock", "targetUserId": 14 }
  ```
  Menyetel `force_unlocked = TRUE` di server sehingga heartbeat berikutnya dari siswa langsung membuka kunci layarnya.
- **Aksi `reset`**:
  ```json
  { "action": "reset", "targetUserId": 14 }
  ```
  Menghapus data pengerjaan dan riwayat nilai siswa sehingga dapat login dan mengulang kembali dari nomor 1.

---

## 6. Prosedur Operasional Pengawas Ujian (SOP Lab)

1. **Membuka Sesi Ujian**:
   - Guru mengumumkan Token Ujian resmi (`UJIAN-SQL-2026`).
   - Guru membuka konsol pengawas di proyektor: [https://www.suhendararyadi.com/admin/ujian/monitoring](https://www.suhendararyadi.com/admin/ujian/monitoring).
2. **Memantau Aktivitas**:
   - Guru memilih filter Rombel sesuai kelas yang sedang diuji (misal: `11 RPL 3`).
   - Mengamati status denyut hijau (*Sedang Mengerjakan*) dan progress bar butir soal.
3. **Menangani Insiden Layar Terkunci**:
   - Jika siswa mengalami pop-up tidak sengaja dan terkunci, nama siswa akan otomatis berpindah ke baris atas dengan badge merah (*Terkunci 5 Mnt*).
   - Guru memverifikasi integritas fisik siswa di lab. Jika valid, Guru menekan tombol **"Buka Kunci"**.
   - Layar siswa terbuka seketika tanpa refresh.
4. **Mengunduh Hasil Akhir**:
   - Setelah seluruh siswa selesai, Guru menekan tombol **"Ekspor CSV"** untuk arsip nilai raport.
