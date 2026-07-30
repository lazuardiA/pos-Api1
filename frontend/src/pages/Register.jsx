import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi";
    if (!form.username.trim() || form.username.trim().length < 3)
      next.username = "Username minimal 3 karakter";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format email tidak valid";
    if (!form.password || form.password.length < 6)
      next.password = "Password minimal 6 karakter";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Konfirmasi password tidak cocok";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registrasi gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl mb-1">Daftar Member Baru</h1>
        <p className="text-sm text-mist mb-6">Buat akun untuk mulai booking kelas gym.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label className="label-field" htmlFor="name">Nama Lengkap</label>
            <input id="name" className="input-field" value={form.name} onChange={update("name")} />
            {errors.name && <p className="text-pulse text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="username">Username</label>
            <input id="username" className="input-field" value={form.username} onChange={update("username")} />
            {errors.username && <p className="text-pulse text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input id="email" type="email" className="input-field" value={form.email} onChange={update("email")} />
            {errors.email && <p className="text-pulse text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="phone">No. Telepon (opsional)</label>
            <input id="phone" className="input-field" value={form.phone} onChange={update("phone")} />
          </div>

          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input id="password" type="password" className="input-field" value={form.password} onChange={update("password")} />
            {errors.password && <p className="text-pulse text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="confirmPassword">Konfirmasi Password</label>
            <input id="confirmPassword" type="password" className="input-field" value={form.confirmPassword} onChange={update("confirmPassword")} />
            {errors.confirmPassword && <p className="text-pulse text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {serverError && <p className="text-pulse text-sm">{serverError}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-sm text-mist mt-6 text-center">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-signal hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
