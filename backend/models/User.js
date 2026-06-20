const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "student"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
