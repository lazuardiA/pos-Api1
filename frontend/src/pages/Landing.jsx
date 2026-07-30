import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-20 sm:py-28 text-center">
        <p className="text-signal text-sm font-semibold tracking-widest uppercase mb-4">
          Booking gym jadi lebih simpel
        </p>
        <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-6">
          Jadwalkan latihanmu.
          <br />
          <span className="text-pulse">Datang. Genjot. Ulangi.</span>
        </h1>
        <p className="text-mist max-w-xl mx-auto mb-8">
          PulseFit membantu kamu melihat jadwal kelas, booking slot favorit, dan mengelola
          keanggotaan gym — semua dari satu tempat, kapan saja, dari HP maupun laptop.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="btn-primary">Daftar Sekarang</Link>
          <Link to="/login" className="btn-secondary">Saya Sudah Punya Akun</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-20">
        <div className="card p-6">
          <p className="text-pulse font-display text-2xl mb-2">01</p>
          <h3 className="font-semibold mb-1">Lihat Jadwal Kelas</h3>
          <p className="text-sm text-mist">Cari kelas berdasarkan hari, kategori, atau trainer favoritmu.</p>
        </div>
        <div className="card p-6">
          <p className="text-signal font-display text-2xl mb-2">02</p>
          <h3 className="font-semibold mb-1">Booking Sekali Klik</h3>
          <p className="text-sm text-mist">Pilih tanggal, konfirmasi, selesai. Tidak perlu telepon front desk.</p>
        </div>
        <div className="card p-6">
          <p className="text-amber font-display text-2xl mb-2">03</p>
          <h3 className="font-semibold mb-1">Kelola dari Mana Saja</h3>
          <p className="text-sm text-mist">Akses penuh dari smartphone, tanpa perlu install aplikasi tambahan.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
