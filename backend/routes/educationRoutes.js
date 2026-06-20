const express = require("express");

const router = express.Router();

const {
  getAssignments,
  createAssignment,
  deleteAssignment
} = require("../controllers/educationController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

router.get("/assignments", protect, getAssignments);
router.post("/assignments", protect, adminOnly, createAssignment);
router.delete("/assignments/:id", protect, adminOnly, deleteAssignment);

module.exports = router;
