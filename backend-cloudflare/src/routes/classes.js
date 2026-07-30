import { Hono } from "hono";
import { newId, toClassObject } from "../utils/helpers.js";
import { protect, adminOnly } from "../middleware/auth.js";

const classes = new Hono();

// GET /api/classes (filter opsional ?day= &category= &active=true)
classes.get("/", protect, async (c) => {
  const db = c.env.DB;
  const day = c.req.query("day");
  const category = c.req.query("category");
  const activeOnly = c.req.query("active") === "true";

  const conditions = [];
  const values = [];
  if (day) {
    conditions.push("day = ?");
    values.push(day);
  }
  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }
  if (activeOnly) {
    conditions.push("is_active = 1");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { results } = await db
    .prepare(`SELECT * FROM gym_classes ${where} ORDER BY day, start_time`)
    .bind(...values)
    .all();

  return c.json({ count: results.length, classes: results.map(toClassObject) });
});

// GET /api/classes/:id
classes.get("/:id", protect, async (c) => {
  const db = c.env.DB;
  const gymClass = await db
    .prepare("SELECT * FROM gym_classes WHERE id = ?")
    .bind(c.req.param("id"))
    .first();

  if (!gymClass) return c.json({ message: "Kelas tidak ditemukan" }, 404);
  return c.json({ class: toClassObject(gymClass) });
});

// POST /api/classes (admin)
classes.post("/", protect, adminOnly, async (c) => {
  const body = await c.req.json();
  const { name, category, trainer, description, day, startTime, endTime, capacity, room } = body;

  if (!name || !trainer || !day || !startTime || !endTime || !capacity) {
    return c.json(
      { message: "Nama, trainer, hari, jam mulai/selesai, dan kapasitas wajib diisi" },
      400
    );
  }

  const db = c.env.DB;
  const id = newId();

  await db
    .prepare(
      `INSERT INTO gym_classes (id, name, category, trainer, description, day, start_time, end_time, capacity, room, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .bind(
      id,
      name,
      category || "Strength",
      trainer,
      description || "",
      day,
      startTime,
      endTime,
      capacity,
      room || "Studio 1"
    )
    .run();

  const gymClass = await db.prepare("SELECT * FROM gym_classes WHERE id = ?").bind(id).first();
  return c.json({ message: "Kelas berhasil ditambahkan", class: toClassObject(gymClass) }, 201);
});

// PUT /api/classes/:id (admin)
classes.put("/:id", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const existing = await db.prepare("SELECT * FROM gym_classes WHERE id = ?").bind(id).first();

  if (!existing) return c.json({ message: "Kelas tidak ditemukan" }, 404);

  const body = await c.req.json();
  const fieldMap = {
    name: "name",
    category: "category",
    trainer: "trainer",
    description: "description",
    day: "day",
    startTime: "start_time",
    endTime: "end_time",
    capacity: "capacity",
    room: "room",
    isActive: "is_active",
  };

  const updates = [];
  const values = [];
  for (const [key, column] of Object.entries(fieldMap)) {
    if (body[key] !== undefined) {
      updates.push(`${column} = ?`);
      values.push(key === "isActive" ? (body[key] ? 1 : 0) : body[key]);
    }
  }

  if (updates.length > 0) {
    values.push(id);
    await db.prepare(`UPDATE gym_classes SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
  }

  const updated = await db.prepare("SELECT * FROM gym_classes WHERE id = ?").bind(id).first();
  return c.json({ message: "Kelas berhasil diperbarui", class: toClassObject(updated) });
});

// DELETE /api/classes/:id (admin)
classes.delete("/:id", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const existing = await db.prepare("SELECT id FROM gym_classes WHERE id = ?").bind(id).first();

  if (!existing) return c.json({ message: "Kelas tidak ditemukan" }, 404);

  await db.prepare("DELETE FROM bookings WHERE gym_class_id = ?").bind(id).run();
  await db.prepare("DELETE FROM gym_classes WHERE id = ?").bind(id).run();

  return c.json({ message: "Kelas dan booking terkait berhasil dihapus" });
});

export default classes;
