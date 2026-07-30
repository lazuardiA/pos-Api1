link front end  ;https://pos-apifrontend.rakamada45.workers.dev

# Gym Booking - Back-End (Cloudflare Workers + D1)

Versi back-end ini dibuat khusus untuk **Cloudflare Workers**, menggunakan:
- **Hono** — framework mirip Express, tapi jalan di Cloudflare Workers
- **Cloudflare D1** — database SQL bawaan Cloudflare (pengganti MongoDB)
- **Web Crypto API** — untuk hash password (PBKDF2) & JWT, tidak perlu package `bcrypt`

> Kenapa berbeda dari folder `backend/`? Folder `backend/` (Express + MongoDB) **tidak bisa** jalan di Cloudflare Workers karena Workers bukan Node.js biasa (tidak mendukung koneksi TCP langsung yang dibutuhkan MongoDB). Folder `backend-cloudflare/` ini adalah versi yang sudah disesuaikan agar bisa deploy ke Cloudflare.

## Struktur Folder

```
backend-cloudflare/
├── wrangler.toml           # Konfigurasi Cloudflare Workers + binding database D1
├── package.json
├── schema.sql               # Struktur tabel database
├── seed.sql                 # Data demo (akun admin/member + 5 kelas contoh)
└── src/
    ├── index.js             # Entry point, routing utama
    ├── routes/
    │   ├── auth.js
    │   ├── classes.js
    │   ├── bookings.js
    │   └── users.js
    ├── middleware/
    │   └── auth.js          # Verifikasi JWT & role admin
    └── utils/
        ├── password.js      # Hash & verifikasi password (PBKDF2 via Web Crypto)
        ├── jwt.js            # Generate & verifikasi token JWT
        └── helpers.js        # Konversi baris database ke format JSON API
```

## Cara Deploy (Lewat Dashboard Cloudflare, Tanpa Install CLI)

### 1. Buat Database D1

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → menu **Workers & Pages** → tab **D1 SQL Database** (di sidebar kiri).
2. Klik **Create Database**, beri nama `gymbooking-db`, klik **Create**.
3. Setelah dibuat, buka database itu → tab **Console** (query editor di dashboard).
4. Copy seluruh isi file `schema.sql` di folder ini → paste ke Console → klik **Execute** (jalankan). Ini akan membuat tabel `users`, `gym_classes`, `bookings`.
5. Lakukan hal sama dengan isi `seed.sql` → paste ke Console → **Execute**. Ini mengisi akun demo & 5 kelas contoh.
6. Di halaman detail database, catat **Database ID** (format UUID), akan dipakai di langkah berikut.

### 2. Push Kode ke GitHub

Push folder `backend-cloudflare/` ini ke repository GitHub kamu (boleh jadi repo sendiri, atau folder di dalam repo yang sudah ada).

### 3. Isi `wrangler.toml`

Sebelum push (atau edit langsung di GitHub setelah push), buka `wrangler.toml`, ganti:
```
database_id = "GANTI_DENGAN_DATABASE_ID_KAMU"
```
dengan Database ID dari langkah 1.6 di atas.

### 4. Buat Worker & Hubungkan ke GitHub

1. Di dashboard Cloudflare → **Workers & Pages** → **Create** → pilih tab **Workers**.
2. Pilih **Import a repository** / **Connect to Git**, hubungkan akun GitHub kamu, pilih repo yang berisi folder `backend-cloudflare`.
3. Jika repo kamu monorepo (ada folder lain juga), set **Root Directory** ke `backend-cloudflare`.
4. Build command: biarkan default (Cloudflare otomatis mendeteksi `wrangler.toml`).
5. Sebelum deploy, buka bagian **Bindings** / **Settings** → pastikan binding D1 `DB` mengarah ke database `gymbooking-db` yang kamu buat (biasanya otomatis terbaca dari `wrangler.toml`, tapi cek ulang di dashboard).
6. Tambahkan **Environment Variable**:
   - `JWT_SECRET` = string acak rahasia (boleh beda dari yang ada di `wrangler.toml`, environment variable dashboard akan menimpa)
   - `CLIENT_ORIGIN` = URL frontend kamu (isi `*` dulu sementara saat masih testing)
7. Klik **Save and Deploy**.

Setelah deploy selesai, kamu akan dapat URL seperti:
```
https://gymbooking-backend.<username-kamu>.workers.dev
```

### 5. Tes API

Buka `https://gymbooking-backend.<username-kamu>.workers.dev/api/health` di browser — harus muncul respons JSON `{"status":"OK", ...}`.

### 6. Hubungkan ke Front-End

Di pengaturan front-end (Cloudflare Pages/Netlify/Vercel), set environment variable:
```
VITE_API_URL=https://gymbooking-backend.<username-kamu>.workers.dev/api
```

## Akun Demo (dari seed.sql)

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| Member | member1  | member123 |

## Cara Deploy Alternatif (Lewat CLI, jika familiar terminal)

```bash
cd backend-cloudflare
npm install
npx wrangler login
npx wrangler d1 create gymbooking-db     # catat database_id yang muncul, isi ke wrangler.toml
npm run db:migrate:remote
npm run db:seed:remote
npm run deploy
```

## Catatan Keamanan

- Password disimpan ter-hash menggunakan **PBKDF2-SHA256** (Web Crypto API), tidak pernah disimpan dalam bentuk plain text.
- Sesi login dikelola menggunakan **JWT**, ditandatangani menggunakan `JWT_SECRET` yang kamu atur.
- Validasi input dilakukan di setiap route sebelum data disimpan ke database.
- Koneksi ke database D1 hanya bisa dilakukan dari dalam Worker (lewat binding), tidak bisa diakses langsung dari front-end.




link front end  ;https://pos-apifrontend.rakamada45.workers.dev


