import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/bookings/me");
        setBookings(data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcoming = bookings
    .filter((b) => b.status === "booked" && new Date(b.bookingDate) >= new Date().setHours(0, 0, 0, 0))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-1">Halo, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="text-mist mb-8">Selamat datang kembali di PulseFit. Berikut ringkasan aktivitasmu.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <p className="text-mist text-xs uppercase tracking-wide">Membership</p>
          <p className="font-display text-xl mt-1 capitalize text-signal">{user?.membershipType}</p>
        </div>
        <div className="card p-5">
          <p className="text-mist text-xs uppercase tracking-wide">Total Booking Aktif</p>
          <p className="font-display text-xl mt-1 text-pulse">
            {bookings.filter((b) => b.status === "booked").length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-mist text-xs uppercase tracking-wide">Status Akun</p>
          <p className="font-display text-xl mt-1">{user?.isActive ? "Aktif" : "Nonaktif"}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <Link to="/classes" className="btn-primary">Cari & Booking Kelas</Link>
        <Link to="/my-bookings" className="btn-secondary">Lihat Semua Booking</Link>
      </div>

      <h2 className="font-display text-xl mb-4">Booking Mendatang</h2>
      {loading ? (
        <Loader />
      ) : upcoming.length === 0 ? (
        <div className="card p-6 text-mist text-sm">
          Belum ada booking mendatang. <Link to="/classes" className="text-signal hover:underline">Booking kelas sekarang</Link>.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((b) => (
            <div key={b._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.gymClass?.name}</p>
                <p className="text-xs text-mist">
                  {new Date(b.bookingDate).toLocaleDateString("id-ID")} · {b.gymClass?.startTime}-{b.gymClass?.endTime}
                </p>
              </div>
              <span className="text-xs bg-signal/15 text-signal px-2 py-1 rounded">Terjadwal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
