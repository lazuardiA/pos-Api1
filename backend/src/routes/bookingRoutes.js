const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;
