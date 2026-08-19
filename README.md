# 4CWC Indonesia

Situs data & roster Tim Indonesia untuk 4 Digit Catch World Cup (osu!catch).
Dibangun dengan [Astro](https://astro.build) (server-rendered) + [Cloudflare Pages](https://pages.cloudflare.com) +
[Cloudflare D1](https://developers.cloudflare.com/d1/) sebagai database.

## Struktur halaman

| Route | Akses | Isi |
|---|---|---|
| `/` | Publik | Beranda — pencapaian per musim, sorotan roster |
| `/players` | Publik | Player History — roster tiap musim |
| `/admin/login` | Publik | Login (admin & pemain roster pakai form yang sama) |
| `/admin/roster-generator` | Admin saja | Input skor latihan → generate → publikasikan roster |
| `/dashboard` | Login (admin atau pemain) | Roster resmi musim aktif — privat |

Catatan desain: mockup awal hanya punya satu layar "Admin Login". Supaya
`/dashboard` benar-benar bisa dibatasi hanya untuk anggota roster (bukan cuma
admin), backend ini memakai satu tabel `users` dengan kolom `role`
(`admin` atau `player`) dan satu form login yang sama untuk keduanya — admin
masuk ke panel admin + dashboard, pemain hanya masuk ke dashboard. Belum ada
halaman pendaftaran akun pemain sendiri; akun dibuat manual lewat
`scripts/hash-password.mjs` (lihat langkah 4 di bawah).

Bagian "Jadwal Pertandingan" dan "Info Tim" yang ada di mockup desain belum
diimplementasikan di sini (belum ada tabel data untuk itu) — supaya dashboard
tidak menampilkan info statis yang terlihat nyata padahal bukan data
sungguhan. Mudah ditambahkan nanti: tinggal buat tabel baru + query di
`src/pages/dashboard.astro`.

## 1. Install dependencies

```bash
npm install
```

## 2. Buat database D1

```bash
npx wrangler login
npx wrangler d1 create 4cwc-db
```

Salin `database_id` yang muncul ke `wrangler.toml` (ganti
`REPLACE_WITH_YOUR_D1_DATABASE_ID`).

## 3. Jalankan migrasi schema

```bash
npm run db:migrate:local   # untuk development lokal
npm run db:migrate:remote  # untuk database production di Cloudflare
```

Ini akan membuat semua tabel, plus mengisi data historis musim 2022 (hasil
nyata dari wiki resmi osu!: Round of 16 menang atas Swedia 5–0, lalu kalah
dari Korea Selatan 3–6 di Perempat Final).

## 4. Buat akun login pertama

Password di-hash dengan PBKDF2 (SHA-256, 100.000 iterasi) — tidak disimpan
sebagai teks biasa di database. Generate SQL insert-nya:

```bash
node scripts/hash-password.mjs "password-kuat-kamu" admin "M0RU.ID" moru
```

Argumen: `<password> [role: admin|player] [nama tampilan] [username]`.
Jalankan perintah `wrangler d1 execute ...` yang dicetak script di atas untuk
memasukkan user itu ke database (pakai `--remote` untuk production,
`--local` untuk development).

Untuk akun pemain roster (role `player`), jalankan lagi dengan
`role=player` — pemain itu hanya akan bisa mengakses `/dashboard`, bukan
`/admin/roster-generator`.

## 5. Development lokal

```bash
npm run dev
```

## 6. Deploy ke Cloudflare Pages lewat GitHub

1. Push folder ini ke repo GitHub kamu.
2. Di dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, pilih repo ini.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Di **Settings → Functions → D1 database bindings**, tambahkan binding
   dengan nama `DB` yang mengarah ke database `4cwc-db` yang dibuat di
   langkah 2 (ini menyamai binding yang ada di `wrangler.toml`, dibutuhkan
   karena deploy lewat dashboard Git integration tidak selalu membaca
   `wrangler.toml`).
5. Setiap push ke branch utama akan otomatis build & deploy.

> Cloudflare aktif mengembangkan produknya — kalau langkah di dashboard
> terasa berbeda dari yang tertulis di sini, cek dokumentasi terbaru di
> [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/).

## Catatan keamanan & keterbatasan

- Session disimpan sebagai token acak di tabel `sessions`, dikirim lewat
  cookie `httpOnly` + `secure` + `sameSite=lax`, berlaku 7 hari.
- PBKDF2 100.000 iterasi cukup aman, tapi memakan CPU time di Cloudflare
  Workers. Kalau login terasa lambat atau kena limit CPU time di plan Free,
  turunkan `PBKDF2_ITERATIONS` di `src/lib/auth.ts` (dan
  `scripts/hash-password.mjs`, keduanya harus sama).
- Belum ada rate limiting di endpoint login — kalau situs ini publik dan
  dipakai serius, pertimbangkan menambah Cloudflare Turnstile atau rate
  limiting di `/api/login`.
- Language switcher (bendera ID/EN) di navbar baru berupa UI, belum
  benar-benar mengganti bahasa konten.
