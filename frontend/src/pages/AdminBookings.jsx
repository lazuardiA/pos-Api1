import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const statusStyle = {
  booked: "bg-signal/15 text-signal",
  cancelled: "bg-pulse/15 text-pulse",
  completed: "bg-mist/15 text-mist",
};

const statusLabel = {
  booked: "Terjadwal",
  cancelled: "Dibatalkan",
  completed: "Selesai",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await api.get("/bookings", { params });
      setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm("Batalkan booking ini?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan booking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl">Semua Booking</h1>
          <p className="text-mist text-sm mt-1">Pantau seluruh booking dari semua member.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-48">
          <option value="">Semua Status</option>
          <option value="booked">Terjadwal</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <div className="card p-6 text-mist text-sm">Belum ada booking.</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mist border-b border-line">
                <th className="p-4">Member</th>
                <th className="p-4">Kelas</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-line/60 last:border-0">
                  <td className="p-4 font-medium">{b.user?.name}<br /><span className="text-xs text-mist">{b.user?.email}</span></td>
                  <td className="p-4 text-mist">{b.gymClass?.name || "Kelas dihapus"}</td>
                  <td className="p-4 text-mist">{new Date(b.bookingDate).toLocaleDateString("id-ID")}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${statusStyle[b.status]}`}>{statusLabel[b.status]}</span>
                  </td>
                  <td className="p-4 text-right">
                    {b.status === "booked" && (
                      <button onClick={() => handleCancel(b._id)} className="text-pulse text-xs font-semibold hover:underline">Batalkan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
