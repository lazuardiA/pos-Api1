# PulseFit - Gym Booking App (Final Project Pemrograman Web)

Aplikasi web full-stack untuk booking kelas gym, terdiri dari 2 bagian terpisah agar mudah kamu push ke 2 repository GitHub berbeda (atau tetap 1 repo dengan 2 folder):

- **`backend/`** → REST API (Node.js + Express + MongoDB). Lihat `backend/README.md`.
- **`frontend/`** → Tampilan web (React + Vite + Tailwind). Lihat `frontend/README.md`.

## Cara Pakai Cepat

1. Buat 2 repo GitHub kosong, misal: `gymbooking-backend` dan `gymbooking-frontend`.
2. Masukkan isi folder `backend/` ke repo pertama, isi folder `frontend/` ke repo kedua.
   (Atau gabungkan jadi 1 repo dengan struktur `backend/` dan `frontend/` seperti ini — sesuai poin 5 ketentuan, boleh disatukan atau dipisah.)
3. Jalankan back-end dulu (lihat `backend/README.md`), lalu front-end (lihat `frontend/README.md`).
4. Deploy back-end ke Railway/Render, front-end ke Netlify/Vercel.

## Ketentuan Teknis yang Sudah Terpenuhi

- ✅ Navbar/sidebar menuju semua halaman fitur utama
- ✅ Tampilan responsif desktop & smartphone
- ✅ HTML/CSS/JS via React + Tailwind
- ✅ Validasi form sisi client sebelum data dikirim
- ✅ Back-end Node.js/Express, struktur MVC (model - controller - route)
- ✅ Komunikasi front-end ↔ back-end via REST API format JSON
- ✅ Validasi input juga di sisi server
- ✅ Login & autentikasi diproses di back-end, password di-hash (bcrypt), sesi dikelola JWT
- ✅ Fitur logout yang menghapus sesi/token
- ✅ Database MongoDB, CRUD penuh (kelas gym, booking, member)
- ✅ Koneksi database hanya lewat back-end, tidak diakses langsung dari front-end
- ✅ Pertukaran data async (fetch/Axios), tanpa reload halaman
- ✅ Struktur folder rapi & konsisten (pemisahan front-end/back-end/konfigurasi)

## Fitur Tambahan yang Ditambahkan

- Sistem role (member & admin) dengan hak akses berbeda
- Panel admin lengkap: kelola kelas, kelola member (termasuk aktif/nonaktifkan akun), lihat semua booking
- Pencegahan booking ganda & booking saat kelas penuh (kapasitas)
- Filter jadwal kelas berdasarkan hari/kategori/status
- Akun & data demo otomatis via seed script
