import { Hono } from "hono";
import { cors } from "hono/cors";

import authRoutes from "./routes/auth.js";
import classRoutes from "./routes/classes.js";
import bookingRoutes from "./routes/bookings.js";
import userRoutes from "./routes/users.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin, c) => c.env.CLIENT_ORIGIN || "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/api/health", (c) =>
  c.json({ status: "OK", message: "Gym Booking API (Cloudflare Workers) berjalan dengan baik" })
);

app.route("/api/auth", authRoutes);
app.route("/api/classes", classRoutes);
app.route("/api/bookings", bookingRoutes);
app.route("/api/users", userRoutes);

app.notFound((c) => c.json({ message: `Endpoint tidak ditemukan - ${c.req.path}` }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: err.message || "Terjadi kesalahan pada server" }, 500);
});

export default app;
