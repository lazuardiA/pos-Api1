const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route  POST /api/auth/register
// @desc   Registrasi member baru
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, phone } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error("Nama, username, email, dan password wajib diisi");
    }

    const usernameTaken = await User.findOne({ username: username.toLowerCase() });
    if (usernameTaken) {
      res.status(400);
      throw new Error("Username sudah digunakan");
    }

    const emailTaken = await User.findOne({ email: email.toLowerCase() });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email sudah terdaftar");
    }

    const user = await User.create({ name, username, email, password, phone });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: "Registrasi berhasil",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
// @desc   Login member/admin dengan username atau email + password
// @access Public
const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400);
      throw new Error("Username/email dan password wajib diisi");
    }

    const user = await User.findOne({
      $or: [{ username: identifier.toLowerCase() }, { email: identifier.toLowerCase() }],
    }).select("+password");

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Username/email atau password salah");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Username/email atau password salah");
    }

    const token = generateToken(user._id, user.role);
    res.json({
      message: "Login berhasil",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me
// @desc   Ambil data profil user yang sedang login
// @access Private
const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/auth/me
// @desc   Update profil user yang sedang login
// @access Private
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User tidak ditemukan");
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (password) {
      if (password.length < 6) {
        res.status(400);
        throw new Error("Password minimal 6 karakter");
      }
      user.password = password;
    }

    const updated = await user.save();
    res.json({ message: "Profil berhasil diperbarui", user: updated.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateMe };
