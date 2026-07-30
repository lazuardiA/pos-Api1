const mongoose = require("mongoose");

const gymClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kelas wajib diisi"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Cardio", "Strength", "Yoga", "HIIT", "Zumba", "Boxing", "Personal Training"],
      default: "Strength",
    },
    trainer: {
      type: String,
      required: [true, "Nama trainer wajib diisi"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    day: {
      type: String,
      enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      required: [true, "Hari wajib diisi"],
    },
    startTime: {
      type: String, // format "HH:mm"
      required: [true, "Jam mulai wajib diisi"],
    },
    endTime: {
      type: String, // format "HH:mm"
      required: [true, "Jam selesai wajib diisi"],
    },
    capacity: {
      type: Number,
      required: [true, "Kapasitas wajib diisi"],
      min: [1, "Kapasitas minimal 1 orang"],
    },
    room: {
      type: String,
      default: "Studio 1",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GymClass", gymClassSchema);
