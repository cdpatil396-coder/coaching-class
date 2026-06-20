const User = require("../models/User");
const Admission = require("../models/Admission");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const normalizePhone = (value) =>
  typeof value === "string" ? value.trim() : "";

const phoneLookupConditions = (value) => {
  const trimmed = normalizePhone(value);
  const digits = trimmed.replace(/\D/g, "");
  const conditions = [];

  if (trimmed) {
    conditions.push({ phone: trimmed });
  }

  if (digits) {
    conditions.push({ phone: digits });
    conditions.push({
      phone: new RegExp(digits.split("").join("[^0-9]*"))
    });
  }

  return conditions;
};

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
      admissionEmail,
      admissionPhone,
      password
    } = req.body;

    const cleanName = normalizeName(name);
    const cleanEmail = normalizeEmail(
      email || (isEmailLike(contact) ? contact : "")
    );
    const cleanPhoneInput = normalizePhone(
      phone || (!email && contact && !isEmailLike(contact) ? contact : "")
    );
    const cleanPhone = cleanPhoneInput ? cleanPhoneInput.replace(/\D/g, "") : "";
    const cleanAdmissionEmail = normalizeEmail(admissionEmail);
    const cleanAdmissionPhoneInput = normalizePhone(admissionPhone);
    const cleanAdmissionPhone = cleanAdmissionPhoneInput
      ? cleanAdmissionPhoneInput.replace(/\D/g, "")
      : "";

    const finalEmail = cleanEmail || cleanAdmissionEmail;
    const finalPhone = cleanPhone || cleanAdmissionPhone;

    if (!cleanName || !password || (!finalEmail && !finalPhone)) {
      return res.status(400).json({
        message: "Name, password, and email or phone are required"
      });
    }

    const admissionQuery = [];
    if (finalEmail) {
      admissionQuery.push({ email: finalEmail });
    }
    admissionQuery.push(...phoneLookupConditions(cleanPhoneInput));
    admissionQuery.push(...phoneLookupConditions(cleanAdmissionPhoneInput));

    const admission = await Admission.findOne({
      $or: admissionQuery
    });

    if (!admission) {
      return res.status(400).json({
        message: "Please submit admission form before registration"
      });
    }

    const existingUserQuery = [];
    if (finalEmail) {
      existingUserQuery.push({ email: finalEmail });
    }
    existingUserQuery.push(...phoneLookupConditions(cleanPhoneInput));
    existingUserQuery.push(...phoneLookupConditions(cleanAdmissionPhoneInput));

    const existingUser = await User.findOne({
      $or: existingUserQuery
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const userPayload = {
      name: cleanName,
      password: hashedPassword,
      role: "student"
    };

    if (finalEmail) {
      userPayload.email = finalEmail;
    }

    if (finalPhone) {
      userPayload.phone = finalPhone;
    }

    await User.create(userPayload);

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
    const cleanPhoneInput = normalizePhone(
      phone || (!email && identifier && !isEmailLike(identifier) ? identifier : "")
    );
    const cleanPhone = cleanPhoneInput ? cleanPhoneInput.replace(/\D/g, "") : "";

    if (!password || (!cleanEmail && !cleanPhone)) {
      return res.status(400).json({
        message: "Email or phone and password are required"
      });
    }

    const userQuery = [];
    if (cleanEmail) {
      userQuery.push({ email: cleanEmail });
    }
    userQuery.push(...phoneLookupConditions(cleanPhoneInput));

    const user = await User.findOne({
      $or: userQuery
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
