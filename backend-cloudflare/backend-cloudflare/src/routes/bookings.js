import { Hono } from "hono";
import { newId, toBookingObject } from "../utils/helpers.js";
import { protect, adminOnly } from "../middleware/auth.js";

const bookings = new Hono();

const BOOKING_SELECT_WITH_CLASS = `
  SELECT
    b.*,
    gc.id as class_id, gc.name as class_name, gc.category as class_category,
    gc.trainer as class_trainer, gc.day as class_day, gc.start_time as class_start_time,
    gc.end_time as class_end_time, gc.room as class_room, gc.capacity as class_capacity
  FROM bookings b
  LEFT JOIN gym_classes gc ON gc.id = b.gym_class_id
`;

// POST /api/bookings
bookings.post("/", protect, async (c) => {
  const { gymClass, bookingDate, notes } = await c.req.json();
  const user = c.get("user");
  const db = c.env.DB;

  if (!gymClass || !bookingDate) {
    return c.json({ message: "Kelas dan tanggal booking wajib diisi" }, 400);
  }

  const targetClass = await db
    .prepare("SELECT * FROM gym_classes WHERE id = ?")
    .bind(gymClass)
    .first();

  if (!targetClass || !targetClass.is_active) {
    return c.json({ message: "Kelas tidak ditemukan atau sudah tidak aktif" }, 404);
  }

  const countRow = await db
    .prepare(
      "SELECT COUNT(*) as total FROM bookings WHERE gym_class_id = ? AND booking_date = ? AND status = 'booked'"
    )
    .bind(gymClass, bookingDate)
    .first();

  if (countRow.total >= targetClass.capacity) {
    return c.json({ message: "Kelas sudah penuh pada tanggal tersebut" }, 400);
  }

  const alreadyBooked = await db
    .prepare(
      "SELECT id FROM bookings WHERE user_id = ? AND gym_class_id = ? AND booking_date = ? AND status = 'booked'"
    )
    .bind(user.id, gymClass, bookingDate)
    .first();

  if (alreadyBooked) {
    return c.json({ message: "Kamu sudah booking kelas ini pada tanggal tersebut" }, 400);
  }

  const id = newId();
  await db
    .prepare(
      `INSERT INTO bookings (id, user_id, gym_class_id, booking_date, status, notes)
       VALUES (?, ?, ?, ?, 'booked', ?)`
    )
    .bind(id, user.id, gymClass, bookingDate, notes || "")
    .run();

  const booking = await db.prepare(`${BOOKING_SELECT_WITH_CLASS} WHERE b.id = ?`).bind(id).first();
  return c.json({ message: "Booking berhasil dibuat", booking: toBookingObject(booking) }, 201);
});

// GET /api/bookings/me
bookings.get("/me", protect, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  const { results } = await db
    .prepare(`${BOOKING_SELECT_WITH_CLASS} WHERE b.user_id = ? ORDER BY b.booking_date DESC`)
    .bind(user.id)
    .all();

  return c.json({ count: results.length, bookings: results.map(toBookingObject) });
});

// PUT /api/bookings/:id/cancel
bookings.put("/:id/cancel", protect, async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const id = c.req.param("id");

  const booking = await db.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first();
  if (!booking) return c.json({ message: "Booking tidak ditemukan" }, 404);

  const isOwner = booking.user_id === user.id;
  if (!isOwner && user.role !== "admin") {
    return c.json({ message: "Kamu tidak punya akses untuk membatalkan booking ini" }, 403);
  }

  await db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(id).run();
  const updated = await db.prepare(`${BOOKING_SELECT_WITH_CLASS} WHERE b.id = ?`).bind(id).first();

  return c.json({ message: "Booking berhasil dibatalkan", booking: toBookingObject(updated) });
});

// GET /api/bookings (admin, semua member)
bookings.get("/", protect, adminOnly, async (c) => {
  const db = c.env.DB;
  const status = c.req.query("status");

  const query = `
    SELECT
      b.*,
      gc.id as class_id, gc.name as class_name, gc.category as class_category,
      gc.trainer as class_trainer, gc.day as class_day, gc.start_time as class_start_time,
      gc.end_time as class_end_time, gc.room as class_room, gc.capacity as class_capacity,
      u.id as user_id, u.name as user_name, u.username as user_username, u.email as user_email
    FROM bookings b
    LEFT JOIN gym_classes gc ON gc.id = b.gym_class_id
    LEFT JOIN users u ON u.id = b.user_id
    ${status ? "WHERE b.status = ?" : ""}
    ORDER BY b.booking_date DESC
  `;

  const stmt = status ? db.prepare(query).bind(status) : db.prepare(query);
  const { results } = await stmt.all();

  return c.json({ count: results.length, bookings: results.map(toBookingObject) });
});

export default bookings;
