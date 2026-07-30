const express = require("express");
const router = express.Router();
const {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getClasses);
router.get("/:id", protect, getClassById);
router.post("/", protect, adminOnly, createClass);
router.put("/:id", protect, adminOnly, updateClass);
router.delete("/:id", protect, adminOnly, deleteClass);

module.exports = router;
