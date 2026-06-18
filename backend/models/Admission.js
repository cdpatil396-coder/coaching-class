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

  studentClass: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model("Admission", admissionSchema);