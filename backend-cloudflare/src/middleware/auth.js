import { verifyToken } from "../utils/jwt.js";

export const protect = async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Tidak ada akses, token tidak ditemukan" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
      .bind(payload.id)
      .first();

    if (!user || !user.is_active) {
      return c.json({ message: "Akun tidak ditemukan atau nonaktif" }, 401);
    }

    c.set("user", user);
    await next();
  } catch (err) {
    return c.json({ message: "Token tidak valid atau sudah kedaluwarsa" }, 401);
  }
};

export const adminOnly = async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ message: "Akses ditolak, khusus admin" }, 403);
  }
  await next();
};
