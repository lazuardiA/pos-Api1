const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gymClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymClass",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, "Tanggal booking wajib diisi"],
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Satu user tidak boleh double booking di kelas & tanggal yang sama
bookingSchema.index({ user: 1, gymClass: 1, bookingDate: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
