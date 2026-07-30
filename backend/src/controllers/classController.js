const GymClass = require("../models/GymClass");
const Booking = require("../models/Booking");

// @route  GET /api/classes
// @desc   Ambil semua kelas gym (bisa difilter ?day=Senin&category=Yoga)
// @access Private (member & admin)
const getClasses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.day) filter.day = req.query.day;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.active === "true") filter.isActive = true;

    const classes = await GymClass.find(filter).sort({ day: 1, startTime: 1 });
    res.json({ count: classes.length, classes });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/classes/:id
// @desc   Ambil detail 1 kelas gym
// @access Private
const getClassById = async (req, res, next) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) {
      res.status(404);
      throw new Error("Kelas tidak ditemukan");
    }
    res.json({ class: gymClass });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/classes
// @desc   Tambah kelas gym baru
// @access Private/Admin
const createClass = async (req, res, next) => {
  try {
    const { name, category, trainer, description, day, startTime, endTime, capacity, room } =
      req.body;

    if (!name || !trainer || !day || !startTime || !endTime || !capacity) {
      res.status(400);
      throw new Error("Nama, trainer, hari, jam mulai/selesai, dan kapasitas wajib diisi");
    }

    const gymClass = await GymClass.create({
      name,
      category,
      trainer,
      description,
      day,
      startTime,
      endTime,
      capacity,
      room,
    });

    res.status(201).json({ message: "Kelas berhasil ditambahkan", class: gymClass });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/classes/:id
// @desc   Update kelas gym
// @access Private/Admin
const updateClass = async (req, res, next) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) {
      res.status(404);
      throw new Error("Kelas tidak ditemukan");
    }

    Object.assign(gymClass, req.body);
    const updated = await gymClass.save();

    res.json({ message: "Kelas berhasil diperbarui", class: updated });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/classes/:id
// @desc   Hapus kelas gym
// @access Private/Admin
const deleteClass = async (req, res, next) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);
    if (!gymClass) {
      res.status(404);
      throw new Error("Kelas tidak ditemukan");
    }

    await Booking.deleteMany({ gymClass: gymClass._id });
    await gymClass.deleteOne();

    res.json({ message: "Kelas dan booking terkait berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getClasses, getClassById, createClass, updateClass, deleteClass };
