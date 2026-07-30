# PulseFit - Front-End (Gym Booking)

Front-end aplikasi booking gym, dibangun dengan **React (Vite) + Tailwind CSS**, mengonsumsi REST API dari folder `backend/` melalui **Axios**. Tampilan responsif (desktop & mobile) dan menggunakan validasi sisi client sebelum data dikirim ke server.

## Struktur Folder

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx                 # Routing utama (React Router)
    ├── index.css                # Tailwind + style global
    ├── api/
    │   └── axios.js             # Instance axios + interceptor JWT
    ├── context/
    │   └── AuthContext.jsx      # State login/logout/register global
    ├── components/
    │   ├── Navbar.jsx           # Navigasi responsif (hamburger di mobile)
    │   ├── ProtectedRoute.jsx   # Guard halaman yang butuh login/admin
    │   ├── ClassCard.jsx
    │   ├── BookingModal.jsx
    │   └── Loader.jsx
    └── pages/
        ├── Landing.jsx           # Halaman publik
        ├── Login.jsx
        ├── Register.jsx
        ├── Dashboard.jsx         # Ringkasan member
        ├── Classes.jsx           # Jadwal kelas + booking
        ├── MyBookings.jsx        # Riwayat booking member
        ├── Profile.jsx
        ├── AdminClasses.jsx      # CRUD kelas (admin)
        ├── AdminMembers.jsx      # CRUD member (admin)
        ├── AdminBookings.jsx     # Semua booking (admin)
        └── NotFound.jsx
```

## Cara Menjalankan Secara Lokal

1. **Pastikan back-end sudah berjalan** (lihat `backend/README.md`), default di `http://localhost:5000`.

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   ```
   Pastikan `VITE_API_URL` mengarah ke URL back-end kamu (lokal atau yang sudah di-deploy).

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser. Untuk mengakses dari HP dalam jaringan WiFi yang sama, jalankan `npm run dev -- --host` lalu buka `http://<IP-laptop>:5173` di HP.

## Build untuk Production

```bash
npm run build
```
Hasil build ada di folder `dist/`, siap di-deploy ke Netlify/Vercel.

## Deploy ke Netlify/Vercel (gratis)

**Vercel**
1. Push folder `frontend` ke repository GitHub.
2. Import project di [vercel.com](https://vercel.com), set root directory ke `frontend`.
3. Build command: `npm run build`, output directory: `dist`.
4. Tambahkan environment variable `VITE_API_URL` = URL back-end kamu yang sudah di-deploy.

**Netlify**
1. Push folder `frontend` ke GitHub.
2. New site from Git di [netlify.com](https://netlify.com), set base directory `frontend`.
3. Build command: `npm run build`, publish directory: `frontend/dist`.
4. Tambahkan environment variable `VITE_API_URL` di Site settings → Environment variables.

## Akun Demo (setelah backend dijalankan `npm run seed`)

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| Member | member1  | member123 |

## Fitur Utama

- Navigasi utama (navbar + hamburger menu di mobile) menuju semua halaman fitur
- Tampilan responsif desktop & smartphone (Tailwind CSS)
- Form login & registrasi dengan validasi client-side
- Booking kelas gym dengan pemilihan tanggal, mencegah booking ganda & kelas penuh
- Riwayat booking + pembatalan booking
- Panel admin: kelola kelas (CRUD), kelola member (CRUD + aktif/nonaktifkan akun), lihat semua booking
- Autentikasi berbasis JWT, otomatis logout jika sesi kedaluwarsa
