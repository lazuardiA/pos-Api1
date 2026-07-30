const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Melindungi route: wajib mengirim token JWT valid di header Authorization
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: "Akun tidak ditemukan atau nonaktif" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
  }

  return res.status(401).json({ message: "Tidak ada akses, token tidak ditemukan" });
};

// Hanya boleh diakses oleh role admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Akses ditolak, khusus admin" });
};

module.exports = { protect, adminOnly };
