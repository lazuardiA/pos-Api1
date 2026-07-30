import { useState } from "react";

const BookingModal = ({ gymClass, onClose, onConfirm, submitting, errorMsg }) => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    // Validasi sisi client
    if (!date) {
      setLocalError("Tanggal booking wajib dipilih");
      return;
    }
    if (date < today) {
      setLocalError("Tanggal booking tidak boleh di masa lalu");
      return;
    }

    onConfirm({ gymClass: gymClass._id, bookingDate: date, notes });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-md p-6">
        <h3 className="font-display text-xl mb-1">Booking: {gymClass.name}</h3>
        <p className="text-sm text-mist mb-4">
          {gymClass.day}, {gymClass.startTime}-{gymClass.endTime} bersama {gymClass.trainer}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-field" htmlFor="bookingDate">Tanggal Booking</label>
            <input
              id="bookingDate"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="notes">Catatan (opsional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              rows={2}
              placeholder="Contoh: request area dekat jendela"
            />
          </div>

          {(localError || errorMsg) && (
            <p className="text-sm text-pulse">{localError || errorMsg}</p>
          )}

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Batal
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Memproses..." : "Konfirmasi Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
