import { useEffect, useState } from "react";
import api from "../api/axios";
import ClassCard from "../components/ClassCard";
import BookingModal from "../components/BookingModal";
import Loader from "../components/Loader";

const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState("Semua");
  const [selectedClass, setSelectedClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadClasses = async () => {
    setLoading(true);
    try {
      const params = dayFilter !== "Semua" ? { day: dayFilter } : {};
      const { data } = await api.get("/classes", { params });
      setClasses(data.classes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayFilter]);

  const handleConfirmBooking = async (payload) => {
    setSubmitting(true);
    setBookingError("");
    try {
      await api.post("/bookings", payload);
      setSelectedClass(null);
      setSuccessMsg("Booking berhasil! Cek halaman Booking Saya untuk detailnya.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Gagal membuat booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl">Jadwal Kelas</h1>
          <p className="text-mist text-sm mt-1">Pilih kelas dan tanggal, lalu booking sekarang.</p>
        </div>
        <select
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-md bg-signal/15 border border-signal/40 text-signal text-sm">
          {successMsg}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : classes.length === 0 ? (
        <div className="card p-6 text-mist text-sm">Tidak ada kelas untuk filter ini.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <ClassCard key={c._id} gymClass={c} onBook={setSelectedClass} />
          ))}
        </div>
      )}

      {selectedClass && (
        <BookingModal
          gymClass={selectedClass}
          onClose={() => {
            setSelectedClass(null);
            setBookingError("");
          }}
          onConfirm={handleConfirmBooking}
          submitting={submitting}
          errorMsg={bookingError}
        />
      )}
    </div>
  );
};

export default Classes;
