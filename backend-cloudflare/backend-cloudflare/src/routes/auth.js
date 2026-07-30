import { Hono } from "hono";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { newId, toSafeUser } from "../utils/helpers.js";
import { protect } from "../middleware/auth.js";

const auth = new Hono();

// POST /api/auth/register
auth.post("/register", async (c) => {
  const { name, username, email, password, phone } = await c.req.json();

  if (!name || !username || !email || !password) {
    return c.json({ message: "Nama, username, email, dan password wajib diisi" }, 400);
  }
  if (password.length < 6) {
    return c.json({ message: "Password minimal 6 karakter" }, 400);
  }

  const db = c.env.DB;
  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  const existing = await db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .bind(cleanUsername, cleanEmail)
    .first();

  if (existing) {
    return c.json({ message: "Username atau email sudah digunakan" }, 400);
  }

  const id = newId();
  const passwordHash = await hashPassword(password);

  await db
    .prepare(
      `INSERT INTO users (id, name, username, email, password_hash, phone, role, membership_type, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 'member', 'basic', 1)`
    )
    .bind(id, name.trim(), cleanUsername, cleanEmail, passwordHash, (phone || "").trim())
    .run();

  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  const token = await generateToken(id, "member", c.env.JWT_SECRET);

  return c.json({ message: "Registrasi berhasil", token, user: toSafeUser(user) }, 201);
});

// POST /api/auth/login
auth.post("/login", async (c) => {
  const { identifier, password } = await c.req.json();

  if (!identifier || !password) {
    return c.json({ message: "Username/email dan password wajib diisi" }, 400);
  }

  const db = c.env.DB;
  const idLower = identifier.trim().toLowerCase();

  const user = await db
    .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
    .bind(idLower, idLower)
    .first();

  if (!user || !user.is_active) {
    return c.json({ message: "Username/email atau password salah" }, 401);
  }

  const isMatch = await verifyPassword(password, user.password_hash);
  if (!isMatch) {
    return c.json({ message: "Username/email atau password salah" }, 401);
  }

  const token = await generateToken(user.id, user.role, c.env.JWT_SECRET);
  return c.json({ message: "Login berhasil", token, user: toSafeUser(user) });
});

// GET /api/auth/me
auth.get("/me", protect, async (c) => {
  return c.json({ user: toSafeUser(c.get("user")) });
});

// PUT /api/auth/me
auth.put("/me", protect, async (c) => {
  const { name, phone, password } = await c.req.json();
  const current = c.get("user");
  const db = c.env.DB;

  const updates = [];
  const values = [];

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }
  if (phone !== undefined) {
    updates.push("phone = ?");
    values.push(phone);
  }
  if (password) {
    if (password.length < 6) {
      return c.json({ message: "Password minimal 6 karakter" }, 400);
    }
    updates.push("password_hash = ?");
    values.push(await hashPassword(password));
  }

  if (updates.length > 0) {
    values.push(current.id);
    await db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
  }

  const updated = await db.prepare("SELECT * FROM users WHERE id = ?").bind(current.id).first();
  return c.json({ message: "Profil berhasil diperbarui", user: toSafeUser(updated) });
});

export default auth;
