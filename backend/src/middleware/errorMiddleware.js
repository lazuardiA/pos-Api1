// 404 handler untuk route yang tidak ditemukan
const notFound = (req, res, next) => {
  const error = new Error(`Endpoint tidak ditemukan - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handler error terpusat, mengembalikan pesan error JSON yang rapi
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Error validasi Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Error duplicate key (unique constraint) Mongoose
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} sudah digunakan, silakan gunakan yang lain`
      : "Data sudah ada (duplikat)";
  }

  // Error cast (misal id tidak valid)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "ID tidak valid";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
