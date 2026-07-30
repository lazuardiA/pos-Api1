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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/me");
      setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Yakin ingin membatalkan booking ini?")) return;
    setCancellingId(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-1">Booking Saya</h1>
      <p className="text-mist text-sm mb-8">Riwayat dan status booking kelas kamu.</p>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <div className="card p-6 text-mist text-sm">Belum ada riwayat booking.</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mist border-b border-line">
                <th className="p-4">Kelas</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Jam</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-line/60 last:border-0">
                  <td className="p-4 font-medium">{b.gymClass?.name || "Kelas dihapus"}</td>
                  <td className="p-4 text-mist">{new Date(b.bookingDate).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-mist">
                    {b.gymClass ? `${b.gymClass.startTime}-${b.gymClass.endTime}` : "-"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${statusStyle[b.status]}`}>
                      {statusLabel[b.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {b.status === "booked" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                        className="text-pulse text-xs font-semibold hover:underline disabled:opacity-50"
                      >
                        {cancellingId === b._id ? "Membatalkan..." : "Batalkan"}
                      </button>
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

export default MyBookings;
