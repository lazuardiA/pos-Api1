import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  role: "member",
  membershipType: "basic",
};

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
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
      const { data } = await api.get("/users");
      setMembers(data.users);
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
    if (!form.name.trim()) next.name = "Nama wajib diisi";
    if (!editingId) {
      if (!form.username.trim() || form.username.trim().length < 3) next.username = "Username minimal 3 karakter";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format email tidak valid";
      if (!form.password || form.password.length < 6) next.password = "Password minimal 6 karakter";
    }
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
        const { username, email, ...editable } = form;
        await api.put(`/users/${editingId}`, editable);
      } else {
        await api.post("/users", form);
      }
      resetForm();
      setShowForm(false);
      await load();
    } catch (err) {
      setServerError(err.response?.data?.message || "Gagal menyimpan data member");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m) => {
    setForm({ ...emptyForm, ...m, password: "" });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus member ini beserta seluruh booking miliknya?")) return;
    try {
      await api.delete(`/users/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus member");
    }
  };

  const toggleActive = async (m) => {
    try {
      await api.put(`/users/${m.id}`, { isActive: !m.isActive });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status member");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Kelola Member</h1>
          <p className="text-mist text-sm mt-1">Buat akun member baru, ubah data, atau nonaktifkan akun.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary">
          {showForm ? "Tutup Form" : "+ Tambah Member"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="card p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Nama Lengkap</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="text-pulse text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label-field">No. Telepon</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div>
            <label className="label-field">Username {editingId && <span className="normal-case text-mist/70">(tidak bisa diubah)</span>}</label>
            <input className="input-field disabled:opacity-50" disabled={!!editingId} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            {errors.username && <p className="text-pulse text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="label-field">Email {editingId && <span className="normal-case text-mist/70">(tidak bisa diubah)</span>}</label>
            <input className="input-field disabled:opacity-50" disabled={!!editingId} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="text-pulse text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label-field">{editingId ? "Reset Password (opsional)" : "Password"}</label>
            <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? "Kosongkan jika tidak diubah" : ""} />
            {errors.password && <p className="text-pulse text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label-field">Role</label>
            <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="label-field">Tipe Membership</label>
            <select className="input-field" value={form.membershipType} onChange={(e) => setForm({ ...form, membershipType: e.target.value })}>
              <option value="basic">Basic</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>

          {serverError && <p className="text-pulse text-sm sm:col-span-2">{serverError}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Member"}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="btn-secondary">Batal</button>
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
                <th className="p-4">Username / Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Membership</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-line/60 last:border-0">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4 text-mist">{m.username}<br /><span className="text-xs">{m.email}</span></td>
                  <td className="p-4 capitalize">{m.role}</td>
                  <td className="p-4 capitalize text-mist">{m.membershipType}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(m)} className={`px-2 py-1 rounded text-xs ${m.isActive ? "bg-signal/15 text-signal" : "bg-pulse/15 text-pulse"}`}>
                      {m.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => handleEdit(m)} className="text-signal text-xs font-semibold hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-pulse text-xs font-semibold hover:underline">Hapus</button>
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

export default AdminMembers;
