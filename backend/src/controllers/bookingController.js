const Booking = require("../models/Booking");
const GymClass = require("../models/GymClass");

// @route  POST /api/bookings
// @desc   Booking sebuah kelas gym pada tanggal tertentu
// @access Private (member)
const createBooking = async (req, res, next) => {
  try {
    const { gymClass, bookingDate, notes } = req.body;

    if (!gymClass || !bookingDate) {
      res.status(400);
      throw new Error("Kelas dan tanggal booking wajib diisi");
    }

    const targetClass = await GymClass.findById(gymClass);
    if (!targetClass || !targetClass.isActive) {
      res.status(404);
      throw new Error("Kelas tidak ditemukan atau sudah tidak aktif");
    }

    const existingCount = await Booking.countDocuments({
      gymClass,
      bookingDate: new Date(bookingDate),
      status: "booked",
    });

    if (existingCount >= targetClass.capacity) {
      res.status(400);
      throw new Error("Kelas sudah penuh pada tanggal tersebut");
    }

    const alreadyBooked = await Booking.findOne({
      user: req.user._id,
      gymClass,
      bookingDate: new Date(bookingDate),
      status: "booked",
    });

    if (alreadyBooked) {
      res.status(400);
      throw new Error("Kamu sudah booking kelas ini pada tanggal tersebut");
    }

    const booking = await Booking.create({
      user: req.user._id,
      gymClass,
      bookingDate,
      notes,
    });

    const populated = await booking.populate("gymClass");
    res.status(201).json({ message: "Booking berhasil dibuat", booking: populated });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/bookings/me
// @desc   Ambil semua booking milik user yang login
// @access Private (member)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("gymClass")
      .sort({ bookingDate: -1 });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/bookings/:id/cancel
// @desc   Batalkan booking milik sendiri
// @access Private (member, atau admin)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking tidak ditemukan");
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Kamu tidak punya akses untuk membatalkan booking ini");
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking berhasil dibatalkan", booking });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/bookings
// @desc   Ambil semua booking (semua member) - untuk admin
// @access Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate("gymClass")
      .populate("user", "name username email")
      .sort({ bookingDate: -1 });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };
