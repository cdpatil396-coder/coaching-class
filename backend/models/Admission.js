const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({

  studentName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },

  studentClass: {
    type: String,
    required: true
  },

  courses: {
    type: [String],
    required: true
  },

  feeStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },

  address: {
    type: String,
    required: false,
    default: ""
  },

  notes: {
    type: String,
    required: false,
    default: ""
  },

  receiptNo: {
    type: String,
    required: false,
    default: ""
  },

  paidAt: {
    type: Date,
    required: false
  },

  testResults: {
    type: [
      {
        testName: String,
        course: String,
        score: Number,
        maxScore: Number,
        date: String
      }
    ],
    default: []
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model("Admission", admissionSchema);
