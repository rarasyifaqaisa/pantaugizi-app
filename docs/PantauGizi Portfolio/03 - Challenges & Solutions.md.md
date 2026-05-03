# Challenges & Solutions

## Challenge 1: Camera Access di iPhone
**Problem:** Safari iOS butuh HTTPS untuk getUserMedia API.
            Development pakai HTTP = kamera tidak bisa diakses.

**Solusi:** Ganti ke `<input type="file" capture="environment">`
           Ini cara native iOS yang tidak butuh HTTPS dan
           langsung buka kamera belakang.

**Insight:** Solusi ini justru lebih sesuai dengan
            Apple Human Interface Guidelines — menggunakan
            native system UI daripada custom camera overlay.

---

## Challenge 2: Database Makanan Indonesia
**Problem:** Tidak ada open dataset nutrisi makanan Indonesia
            yang bersih dan siap pakai.

**Solusi:** Manual kurasi dari Tabel Komposisi Pangan Indonesia
           (TKPI) Kemenkes. Dimulai dari 10 makanan paling umum,
           grow ke 20+.

**Lesson:** Data quality > data quantity. 20 makanan akurat
           lebih berguna dari 200 makanan tidak akurat.

---

## Challenge 3: Serverless + PostgreSQL
**Problem:** psycopg2 (PostgreSQL driver) tidak bisa koneksi TCP
            di Vercel serverless environment.

**Solusi:** Migrasi dari SQLAlchemy ke Supabase Python SDK
           yang pakai HTTP REST, bukan TCP langsung.

**Lesson:** Serverless punya constraint berbeda dari traditional server.
           Harus pilih tools yang serverless-compatible.

---

## Challenge 4: Deploy Gratis Tanpa Kartu Kredit
**Problem:** Railway, Render, Koyeb semua butuh payment method.

**Solusi:** Vercel — satu platform untuk frontend + backend serverless.
           Tidak butuh kartu kredit sama sekali.