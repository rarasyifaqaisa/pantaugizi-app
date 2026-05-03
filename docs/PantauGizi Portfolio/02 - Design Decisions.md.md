# Design Decisions

## Kenapa PWA, bukan Native iOS?
**Constraint:** Tidak punya MacBook untuk Xcode
**Keputusan:** Progressive Web App dengan React
**Trade-off:** Tidak bisa submit ke App Store
**Mitigasi:** PWA bisa di-install dari Safari, tampil fullscreen,
             akses kamera — experience sangat mirip native

**Lesson:** Constraint memaksa saya lebih kreatif dan justru
           menemukan solusi yang lebih accessible.

## Kenapa Imagga, bukan Google Vision?
**Awal:** Pilih Google Vision API (lebih terkenal)
**Problem:** Butuh billing diaktifkan, kartu kredit required
**Keputusan:** Pindah ke Imagga — free 1000 calls/bulan, no credit card
**Lesson:** Selalu ada alternatif. Research sebelum commit.

## Kenapa keyword matching, bukan pure AI?
**Problem:** AI return label generik ("rice", "food", "dish")
            Tidak tahu "nasi goreng" atau "rendang" spesifik
**Solusi:** Setiap makanan di database punya array keywords
           yang mungkin di-return AI
**Hasil:** Akurasi naik dari ~40% ke ~73%

## Kenapa Supabase?
- Gratis tier yang generous
- PostgreSQL = familiar, powerful
- Built-in REST API sangat membantu untuk serverless