const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      default: ""
    },
    batch: {
      type: String,
      required: true,
      enum: ["10th", "11th", "12th"]
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    dueDate: {
      type: String,
      required: false,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
