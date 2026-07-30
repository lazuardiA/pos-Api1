// Jalankan dengan: npm run seed
// Membuat 1 akun admin demo, 1 akun member demo, dan beberapa kelas contoh
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const GymClass = require("../models/GymClass");

const run = async () => {
  await connectDB();

  await User.deleteMany({ username: { $in: ["admin", "member1"] } });
  await GymClass.deleteMany({});

  await User.create({
    name: "Admin Gym",
    username: "admin",
    email: "admin@gymbooking.com",
    password: "admin123",
    role: "admin",
    membershipType: "platinum",
  });

  await User.create({
    name: "Budi Santoso",
    username: "member1",
    email: "member1@gymbooking.com",
    password: "member123",
    role: "member",
    membershipType: "silver",
  });

  await GymClass.insertMany([
    {
      name: "Morning Yoga Flow",
      category: "Yoga",
      trainer: "Sarah Wijaya",
      description: "Kelas yoga ringan untuk memulai hari dengan tenang",
      day: "Senin",
      startTime: "06:00",
      endTime: "07:00",
      capacity: 15,
      room: "Studio 1",
    },
    {
      name: "HIIT Blast",
      category: "HIIT",
      trainer: "Rangga Pratama",
      description: "Latihan interval intensitas tinggi untuk membakar kalori maksimal",
      day: "Selasa",
      startTime: "17:00",
      endTime: "18:00",
      capacity: 20,
      room: "Studio 2",
    },
    {
      name: "Strength Fundamentals",
      category: "Strength",
      trainer: "Dimas Aditya",
      description: "Latihan beban dasar untuk membangun kekuatan otot",
      day: "Rabu",
      startTime: "18:00",
      endTime: "19:00",
      capacity: 12,
      room: "Gym Floor",
    },
    {
      name: "Zumba Party",
      category: "Zumba",
      trainer: "Nina Kartika",
      description: "Kelas dansa energik yang menyenangkan untuk semua level",
      day: "Kamis",
      startTime: "19:00",
      endTime: "20:00",
      capacity: 25,
      room: "Studio 1",
    },
    {
      name: "Boxing Basics",
      category: "Boxing",
      trainer: "Andra Firmansyah",
      description: "Teknik dasar tinju sekaligus melatih ketahanan tubuh",
      day: "Jumat",
      startTime: "16:00",
      endTime: "17:00",
      capacity: 10,
      room: "Boxing Ring",
    },
  ]);

  console.log("[SEED] Data demo berhasil dibuat:");
  console.log("       Admin  -> username: admin   | password: admin123");
  console.log("       Member -> username: member1 | password: member123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
