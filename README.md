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
| `/admin/matches` | Admin saja | Kelola jadwal & hasil pertandingan |
| `/admin/team-info` | Admin saja | Kelola catatan/link Info Tim |
| `/dashboard` | Login (admin atau pemain) | Roster resmi + Jadwal Pertandingan + Info Tim musim aktif — privat |

Catatan desain: mockup awal hanya punya satu layar "Admin Login". Supaya
`/dashboard` benar-benar bisa dibatasi hanya untuk anggota roster (bukan cuma
admin), backend ini memakai satu tabel `users` dengan kolom `role`
(`admin` atau `player`) dan satu form login yang sama untuk keduanya — admin
masuk ke panel admin + dashboard, pemain hanya masuk ke dashboard. Belum ada
halaman pendaftaran akun pemain sendiri; akun dibuat manual lewat
`scripts/hash-password.mjs` (lihat langkah 4 di bawah).

"Jadwal Pertandingan" dan "Info Tim" dari mockup sekarang sudah jalan, dengan
tabel `matches` dan `team_info` plus panel admin sendiri (`/admin/matches`,
`/admin/team-info`). Keduanya kosong sampai admin mengisinya — dashboard tidak
menampilkan data contoh yang terlihat nyata.

Baris `team_info` punya kolom `visible_to`: `roster` terlihat oleh semua yang
login, `admin` hanya terlihat oleh admin.

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

Ini hanya membuat tabel — database mulai kosong.

Data historis musim 2022 dipisah ke `seed.sql` (hasil nyata dari wiki resmi
osu!: Round of 16 menang atas Swedia 5–0, lalu kalah dari Korea Selatan 3–6 di
Perempat Final). Jalankan hanya kalau memang mau dipakai:

```bash
npx wrangler d1 execute 4cwc-db --remote --file=./seed.sql
```

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

## 6. Deploy ke Cloudflare Workers

Proyek ini di-deploy sebagai **Worker** (bukan Cloudflare Pages).

```bash
npm run deploy
```

Yang dijalankan: `astro build && wrangler deploy -c dist/server/wrangler.json`.

### Kenapa pakai `-c dist/server/wrangler.json`

Ini penting dan sempat bikin situs rusak. Adapter `@astrojs/cloudflare`
menaruh bundle server di `dist/server/` dan file statis di `dist/client/`,
lalu menulis config siap-deploy di `dist/server/wrangler.json` (berisi
`main = entry.mjs` dan binding `ASSETS` ke `../client`).

`wrangler.toml` di root **sengaja tidak punya `main` dan `[assets]`**, karena
file itu ikut dibaca `astro build` — dan build berjalan sebelum `dist/` ada,
jadi kalau `main` menunjuk ke hasil build, checkout bersih gagal build.

Konsekuensinya: deploy dengan `wrangler.toml` root menghasilkan Worker tanpa
entrypoint, dan **setiap route menjawab `[object Object]`**. Selalu deploy
lewat `npm run deploy`.

Kalau memakai integrasi Git (Workers Builds) di dashboard Cloudflare, set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy -c dist/server/wrangler.json`

### Catatan `compatibility_date`

`compatibility_date` dikunci di `2025-09-01`. Dengan Astro 7 +
`@astrojs/cloudflare` 14, compatibility date sekitar `2025-10` ke atas membuat
body hasil render tidak lagi dikenali sebagai body Response yang sah, sehingga
di-stringify jadi `[object Object]` — persis gejala yang sama seperti di atas,
tapi penyebabnya beda. Jangan naikkan tanggal ini tanpa mengetes render
halaman lebih dulu.

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
- Language switcher (bendera ID/EN) sudah berfungsi: pilihan disimpan di cookie
  `4cwc_lang` dan teks antarmuka diambil dari `src/lib/i18n.ts`. Yang
  diterjemahkan adalah teks antarmuka — isi data dari database (nama pemain,
  label musim, catatan admin) tetap tampil apa adanya.
