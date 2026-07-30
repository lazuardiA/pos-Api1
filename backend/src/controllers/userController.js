const User = require("../models/User");
const Booking = require("../models/Booking");

// @route  GET /api/users
// @desc   Ambil semua data member (untuk admin)
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ count: users.length, users: users.map((u) => u.toSafeObject()) });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/users/:id
// @desc   Ambil detail 1 member
// @access Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Member tidak ditemukan");
    }
    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/users
// @desc   Admin membuat akun member baru secara manual
// @access Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, username, email, password, phone, role, membershipType } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error("Nama, username, email, dan password wajib diisi");
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      phone,
      role,
      membershipType,
    });

    res.status(201).json({ message: "Member berhasil dibuat", user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/users/:id
// @desc   Admin update data member (role, membership, status aktif, dll)
// @access Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Member tidak ditemukan");
    }

    const { name, phone, role, membershipType, isActive, password } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (membershipType) user.membershipType = membershipType;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password;

    const updated = await user.save();
    res.json({ message: "Member berhasil diperbarui", user: updated.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/users/:id
// @desc   Hapus akun member beserta booking miliknya
// @access Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Member tidak ditemukan");
    }

    await Booking.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ message: "Member berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
