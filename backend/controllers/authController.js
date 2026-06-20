const User = require("../models/User");
const Admission = require("../models/Admission");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizePhone = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeName = (value) =>
  typeof value === "string" ? value.trim() : "";

const isEmailLike = (value) =>
  typeof value === "string" && value.includes("@");

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      contact,
      password
    } = req.body;

    const cleanName = normalizeName(name);
    const cleanEmail = normalizeEmail(
      email || (isEmailLike(contact) ? contact : "")
    );
    const cleanPhone = normalizePhone(
      phone || (!email && contact && !isEmailLike(contact) ? contact : "")
    );

    if (!cleanName || !password || (!cleanEmail && !cleanPhone)) {
      return res.status(400).json({
        message: "Name, password, and email or phone are required"
      });
    }

    const admission = await Admission.findOne({
      $or: [
        cleanEmail ? { email: cleanEmail } : null,
        cleanPhone ? { phone: cleanPhone } : null
      ].filter(Boolean)
    });

    if (!admission) {
      return res.status(400).json({
        message: "Please submit admission form before registration"
      });
    }

    const existingUser = await User.findOne({
      $or: [
        cleanEmail ? { email: cleanEmail } : null,
        cleanPhone ? { phone: cleanPhone } : null
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      name: cleanName,
      email: cleanEmail || undefined,
      phone: cleanPhone || undefined,
      password: hashedPassword,
      role: "student"
    });

    res.status(201).json({
      message: "Registration Successful"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.login = async (req, res) => {

  try {

    const { identifier, email, phone, password } = req.body;
    const cleanEmail = normalizeEmail(
      email || (isEmailLike(identifier) ? identifier : "")
    );
    const cleanPhone = normalizePhone(
      phone || (!email && identifier && !isEmailLike(identifier) ? identifier : "")
    );

    if (!password || (!cleanEmail && !cleanPhone)) {
      return res.status(400).json({
        message: "Email or phone and password are required"
      });
    }

    const user = await User.findOne({
      $or: [
        cleanEmail ? { email: cleanEmail } : null,
        cleanPhone ? { phone: cleanPhone } : null
      ].filter(Boolean)
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};
