import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
    <p className="font-display text-6xl text-pulse mb-4">404</p>
    <h1 className="font-display text-2xl mb-2">Halaman tidak ditemukan</h1>
    <p className="text-mist mb-6">Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada.</p>
    <Link to="/" className="btn-primary">Kembali ke Beranda</Link>
  </div>
);

export default NotFound;
