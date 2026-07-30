import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateStoredUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi";
    if (form.password && form.password.length < 6) next.password = "Password minimal 6 karakter";
    if (form.password && form.password !== form.confirmPassword)
      next.confirmPassword = "Konfirmasi password tidak cocok";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { name: form.name.trim(), phone: form.phone.trim() };
      if (form.password) payload.password = form.password;

      const { data } = await api.put("/auth/me", payload);
      updateStoredUser(data.user);
      setMessage("Profil berhasil diperbarui");
      setForm({ ...form, password: "", confirmPassword: "" });
    } catch (err) {
      setServerError(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-1">Profil Saya</h1>
      <p className="text-mist text-sm mb-8">Kelola data akun dan keamanan login kamu.</p>

      <div className="card p-6 mb-6 text-sm">
        <div className="flex justify-between py-1.5"><span className="text-mist">Username</span><span>{user?.username}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-mist">Email</span><span>{user?.email}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-mist">Membership</span><span className="capitalize">{user?.membershipType}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-mist">Role</span><span className="capitalize">{user?.role}</span></div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="card p-6 flex flex-col gap-4">
        <h2 className="font-display text-lg">Edit Data</h2>

        <div>
          <label className="label-field" htmlFor="name">Nama Lengkap</label>
          <input id="name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="text-pulse text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="phone">No. Telepon</label>
          <input id="phone" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div>
          <label className="label-field" htmlFor="password">Password Baru (opsional)</label>
          <input id="password" type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Kosongkan jika tidak diganti" />
          {errors.password && <p className="text-pulse text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="confirmPassword">Konfirmasi Password Baru</label>
          <input id="confirmPassword" type="password" className="input-field" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          {errors.confirmPassword && <p className="text-pulse text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {message && <p className="text-signal text-sm">{message}</p>}
        {serverError && <p className="text-pulse text-sm">{serverError}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
