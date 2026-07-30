import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const emptyForm = {
  name: "",
  category: "Strength",
  trainer: "",
  description: "",
  day: "Senin",
  startTime: "",
  endTime: "",
  capacity: 10,
  room: "",
};

const categories = ["Cardio", "Strength", "Yoga", "HIIT", "Zumba", "Boxing", "Personal Training"];
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/classes");
      setClasses(data.classes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Nama kelas wajib diisi";
    if (!form.trainer.trim()) next.trainer = "Nama trainer wajib diisi";
    if (!form.startTime) next.startTime = "Jam mulai wajib diisi";
    if (!form.endTime) next.endTime = "Jam selesai wajib diisi";
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      next.endTime = "Jam selesai harus setelah jam mulai";
    if (!form.capacity || form.capacity < 1) next.capacity = "Kapasitas minimal 1";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/classes/${editingId}`, form);
      } else {
        await api.post("/classes", form);
      }
      resetForm();
      setShowForm(false);
      await load();
    } catch (err) {
      setServerError(err.response?.data?.message || "Gagal menyimpan kelas");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      category: c.category,
      trainer: c.trainer,
      description: c.description || "",
      day: c.day,
      startTime: c.startTime,
      endTime: c.endTime,
      capacity: c.capacity,
      room: c.room || "",
    });
    setEditingId(c._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus kelas ini beserta seluruh booking terkait?")) return;
    try {
      await api.delete(`/classes/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kelas");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Kelola Kelas</h1>
          <p className="text-mist text-sm mt-1">Tambah, ubah, atau hapus jadwal kelas gym.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? "Tutup Form" : "+ Tambah Kelas"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="card p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Nama Kelas</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="text-pulse text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label-field">Kategori</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label-field">Trainer</label>
            <input className="input-field" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} />
            {errors.trainer && <p className="text-pulse text-xs mt-1">{errors.trainer}</p>}
          </div>

          <div>
            <label className="label-field">Ruangan</label>
            <input className="input-field" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Studio 1" />
          </div>

          <div>
            <label className="label-field">Hari</label>
            <select className="input-field" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="label-field">Kapasitas</label>
            <input type="number" min={1} className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            {errors.capacity && <p className="text-pulse text-xs mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="label-field">Jam Mulai</label>
            <input type="time" className="input-field" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            {errors.startTime && <p className="text-pulse text-xs mt-1">{errors.startTime}</p>}
          </div>

          <div>
            <label className="label-field">Jam Selesai</label>
            <input type="time" className="input-field" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            {errors.endTime && <p className="text-pulse text-xs mt-1">{errors.endTime}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">Deskripsi</label>
            <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {serverError && <p className="text-pulse text-sm sm:col-span-2">{serverError}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Kelas"}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mist border-b border-line">
                <th className="p-4">Nama</th>
                <th className="p-4">Hari / Jam</th>
                <th className="p-4">Trainer</th>
                <th className="p-4">Kapasitas</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c._id} className="border-b border-line/60 last:border-0">
                  <td className="p-4 font-medium">{c.name}<br /><span className="text-xs text-mist">{c.category}</span></td>
                  <td className="p-4 text-mist">{c.day}, {c.startTime}-{c.endTime}</td>
                  <td className="p-4 text-mist">{c.trainer}</td>
                  <td className="p-4 text-mist">{c.capacity}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => handleEdit(c)} className="text-signal text-xs font-semibold hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-pulse text-xs font-semibold hover:underline">Hapus</button>
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

export default AdminClasses;
