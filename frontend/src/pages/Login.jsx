import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) next.identifier = "Username atau email wajib diisi";
    if (!form.password) next.password = "Password wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.identifier.trim(), form.password);
      navigate(user.role === "admin" ? "/admin/classes" : "/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl mb-1">Masuk ke PulseFit</h1>
        <p className="text-sm text-mist mb-6">Booking kelas gym favoritmu dalam hitungan detik.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label className="label-field" htmlFor="identifier">Username atau Email</label>
            <input
              id="identifier"
              type="text"
              className="input-field"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="mis. member1"
            />
            {errors.identifier && <p className="text-pulse text-xs mt-1">{errors.identifier}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-pulse text-xs mt-1">{errors.password}</p>}
          </div>

          {serverError && <p className="text-pulse text-sm">{serverError}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-mist mt-6 text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-signal hover:underline">
            Daftar member baru
          </Link>
        </p>

        <div className="mt-6 text-xs text-mist border-t border-line pt-4">
          <p className="font-semibold mb-1">Akun demo:</p>
          <p>Admin &nbsp;→ admin / admin123</p>
          <p>Member → member1 / member123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
