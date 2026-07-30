import { Hono } from "hono";
import { hashPassword } from "../utils/password.js";
import { newId, toSafeUser } from "../utils/helpers.js";
import { protect, adminOnly } from "../middleware/auth.js";

const users = new Hono();

// GET /api/users (admin)
users.get("/", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  return c.json({ count: results.length, users: results.map(toSafeUser) });
});

// GET /api/users/:id (admin)
users.get("/:id", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(c.req.param("id")).first();
  if (!user) return c.json({ message: "Member tidak ditemukan" }, 404);
  return c.json({ user: toSafeUser(user) });
});

// POST /api/users (admin membuat member baru manual)
users.post("/", protect, adminOnly, async (c) => {
  const { name, username, email, password, phone, role, membershipType } = await c.req.json();

  if (!name || !username || !email || !password) {
    return c.json({ message: "Nama, username, email, dan password wajib diisi" }, 400);
  }

  const db = c.env.DB;
  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  const existing = await db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .bind(cleanUsername, cleanEmail)
    .first();
  if (existing) return c.json({ message: "Username atau email sudah digunakan" }, 400);

  const id = newId();
  const passwordHash = await hashPassword(password);

  await db
    .prepare(
      `INSERT INTO users (id, name, username, email, password_hash, phone, role, membership_type, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .bind(
      id,
      name.trim(),
      cleanUsername,
      cleanEmail,
      passwordHash,
      (phone || "").trim(),
      role || "member",
      membershipType || "basic"
    )
    .run();

  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  return c.json({ message: "Member berhasil dibuat", user: toSafeUser(user) }, 201);
});

// PUT /api/users/:id (admin)
users.put("/:id", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const existing = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ message: "Member tidak ditemukan" }, 404);

  const body = await c.req.json();
  const updates = [];
  const values = [];

  if (body.name) {
    updates.push("name = ?");
    values.push(body.name);
  }
  if (body.phone !== undefined) {
    updates.push("phone = ?");
    values.push(body.phone);
  }
  if (body.role) {
    updates.push("role = ?");
    values.push(body.role);
  }
  if (body.membershipType) {
    updates.push("membership_type = ?");
    values.push(body.membershipType);
  }
  if (body.isActive !== undefined) {
    updates.push("is_active = ?");
    values.push(body.isActive ? 1 : 0);
  }
  if (body.password) {
    updates.push("password_hash = ?");
    values.push(await hashPassword(body.password));
  }

  if (updates.length > 0) {
    values.push(id);
    await db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
  }

  const updated = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  return c.json({ message: "Member berhasil diperbarui", user: toSafeUser(updated) });
});

// DELETE /api/users/:id (admin)
users.delete("/:id", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const existing = await db.prepare("SELECT id FROM users WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ message: "Member tidak ditemukan" }, 404);

  await db.prepare("DELETE FROM bookings WHERE user_id = ?").bind(id).run();
  await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();

  return c.json({ message: "Member berhasil dihapus" });
});

export default users;
