# Gym Booking - Back-End (API)

Back-end REST API untuk aplikasi booking gym. Dibangun dengan **Node.js, Express, dan MongoDB (Mongoose)**, menggunakan pola **MVC** (Model - Controller - Route) dan autentikasi **JWT**.

## Struktur Folder

```
backend/
├── server.js                  # Entry point aplikasi
├── package.json
├── .env.example                # Contoh konfigurasi environment
└── src/
    ├── config/
    │   └── db.js               # Koneksi ke MongoDB
    ├── models/                 # Schema Mongoose (Model)
    │   ├── User.js
    │   ├── GymClass.js
    │   └── Booking.js
    ├── controllers/            # Logika bisnis (Controller)
    │   ├── authController.js
    │   ├── classController.js
    │   ├── bookingController.js
    │   └── userController.js
    ├── routes/                 # Definisi endpoint (Route)
    │   ├── authRoutes.js
    │   ├── classRoutes.js
    │   ├── bookingRoutes.js
    │   └── userRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js   # Verifikasi JWT & role admin
    │   └── errorMiddleware.js  # Penanganan error terpusat
    └── utils/
        ├── generateToken.js
        └── seed.js             # Skrip membuat akun & data demo
```

## Cara Menjalankan Secara Lokal

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Siapkan MongoDB**
   - Opsi A: Install MongoDB Community secara lokal, atau
   - Opsi B (disarankan, gratis): buat cluster di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), lalu ambil connection string-nya.

3. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   ```
   Lalu edit `.env` dan isi `MONGO_URI` dan `JWT_SECRET` sesuai punya kamu.

4. **(Opsional) Isi data demo** — akan membuat akun admin, member, dan 5 kelas contoh
   ```bash
   npm run seed
   ```
   Akun demo yang dibuat:
   - Admin  → username: `admin`   | password: `admin123`
   - Member → username: `member1` | password: `member123`

5. **Jalankan server**
   ```bash
   npm run dev     # dengan nodemon (auto-restart saat ada perubahan)
   # atau
   npm start
   ```
   Server berjalan di `http://localhost:5000`. Cek `http://localhost:5000/api/health` untuk memastikan API aktif.

## Deploy ke Railway/Render (gratis)

1. Push folder `backend` ini ke repository GitHub tersendiri (atau sebagai folder di dalam monorepo).
2. Buat project baru di [Railway](https://railway.app) atau [Render](https://render.com), hubungkan ke repo GitHub.
3. Set root directory ke `backend` (jika monorepo).
4. Tambahkan environment variables yang sama seperti di `.env` (MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_ORIGIN) di dashboard Railway/Render.
5. Build command: `npm install`, start command: `npm start`.
6. Setelah deploy, catat URL API-nya (misal `https://gymbooking-api.up.railway.app`) untuk dipakai di front-end.

## Daftar Endpoint API

Semua request/response menggunakan format JSON. Endpoint yang butuh login mengirim header:
`Authorization: Bearer <token>`

### Auth (`/api/auth`)
| Method | Endpoint         | Akses         | Deskripsi                          |
|--------|------------------|---------------|-------------------------------------|
| POST   | /api/auth/register | Publik      | Registrasi akun member baru        |
| POST   | /api/auth/login     | Publik      | Login, mengembalikan JWT token     |
| GET    | /api/auth/me         | Login       | Ambil profil sendiri               |
| PUT    | /api/auth/me         | Login       | Update nama/telepon/password sendiri |

### Kelas Gym (`/api/classes`)
| Method | Endpoint          | Akses        | Deskripsi                    |
|--------|-------------------|--------------|-------------------------------|
| GET    | /api/classes         | Login      | Daftar semua kelas (filter `?day=` `?category=`) |
| GET    | /api/classes/:id     | Login      | Detail satu kelas             |
| POST   | /api/classes         | Admin      | Tambah kelas baru              |
| PUT    | /api/classes/:id     | Admin      | Edit kelas                     |
| DELETE | /api/classes/:id     | Admin      | Hapus kelas                    |

### Booking (`/api/bookings`)
| Method | Endpoint               | Akses        | Deskripsi                          |
|--------|------------------------|--------------|--------------------------------------|
| POST   | /api/bookings             | Member      | Booking kelas pada tanggal tertentu |
| GET    | /api/bookings/me          | Member      | Lihat booking milik sendiri          |
| PUT    | /api/bookings/:id/cancel  | Member/Admin| Batalkan booking                     |
| GET    | /api/bookings             | Admin       | Lihat semua booking semua member     |

### Member (`/api/users`) — khusus Admin
| Method | Endpoint         | Akses  | Deskripsi                    |
|--------|------------------|--------|-------------------------------|
| GET    | /api/users          | Admin | Daftar semua member           |
| GET    | /api/users/:id      | Admin | Detail satu member            |
| POST   | /api/users          | Admin | Buat akun member manual       |
| PUT    | /api/users/:id      | Admin | Edit data/role member         |
| DELETE | /api/users/:id      | Admin | Hapus akun member             |

## Catatan Keamanan

- Password disimpan ter-hash menggunakan **bcrypt** (`bcryptjs`), tidak pernah disimpan dalam bentuk plain text.
- Sesi login dikelola menggunakan **JSON Web Token (JWT)** yang dikirim client di header `Authorization`.
- Validasi input dilakukan di sisi server (lihat masing-masing controller & Mongoose schema) selain validasi di front-end.
