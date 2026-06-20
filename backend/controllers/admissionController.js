const Admission =
require("../models/Admission");
const User = require("../models/User");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = (value) =>
  normalizeString(value).toLowerCase();

const normalizePhone = (value) =>
  normalizeString(value);

const normalizeCourses = (courses) => {
  if (Array.isArray(courses)) {
    return [...new Set(courses.map(normalizeString).filter(Boolean))];
  }

  if (typeof courses === "string" && courses.trim()) {
    return [courses.trim()];
  }

  return [];
};

const normalizeNotes = (value) =>
  typeof value === "string" ? value.trim() : "";

/* Create Admission */

exports.createAdmission =
async (req, res) => {

  try {
    const courses = normalizeCourses(req.body.courses);
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);

    if (!req.body.studentName || !phone || !req.body.studentClass || !courses.length) {
      return res.status(400).json({
        message: "Name, phone, class, and at least one course are required"
      });
    }

    const admission = await Admission.create({
      ...req.body,
      studentName: normalizeString(req.body.studentName),
      phone,
      email: email || undefined,
      studentClass: normalizeString(req.body.studentClass),
      courses,
      address: normalizeString(req.body.address),
      notes: normalizeNotes(req.body.notes),
      feeStatus: req.body.feeStatus || "pending"
    });

    res.status(201).json({
      message: "Admission Submitted",
      admission
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* Get All Admissions */

exports.getAdmissions =
async (req, res) => {

  try {

    const admissions =
    await Admission.find().sort({
      createdAt: -1
    });

    res.json(admissions);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* Get Logged In Student Admission */

exports.getMyAdmission =
async (req, res) => {

  try {

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const admission = await Admission.findOne({
      $or: [
        user.email ? { email: user.email.toLowerCase().trim() } : null,
        user.phone ? { phone: user.phone.trim() } : null
      ].filter(Boolean)
    }).sort({
      createdAt: -1
    });

    if (!admission) {
      return res.status(404).json({
        message: "Admission details not found"
      });
    }

    res.json(admission);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* Delete Admission */

exports.deleteAdmission =
async (req, res) => {

  try {

    await Admission.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Student Deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* Update Admission */

exports.updateAdmission =
async (req, res) => {

  try {
    const payload = {
      ...req.body,
      studentName: req.body.studentName
        ? normalizeString(req.body.studentName)
        : req.body.studentName,
      phone: req.body.phone ? normalizePhone(req.body.phone) : req.body.phone,
      email: req.body.email
        ? normalizeEmail(req.body.email)
        : req.body.email,
      studentClass: req.body.studentClass
        ? normalizeString(req.body.studentClass)
        : req.body.studentClass,
      courses: req.body.courses
        ? normalizeCourses(req.body.courses)
        : req.body.courses,
      address: req.body.address !== undefined
        ? normalizeString(req.body.address)
        : req.body.address,
      notes: req.body.notes !== undefined
        ? normalizeNotes(req.body.notes)
        : req.body.notes,
      feeStatus: req.body.feeStatus === "pending" || req.body.feeStatus === "paid"
        ? req.body.feeStatus
        : undefined
    };

    if (Array.isArray(payload.courses) && !payload.courses.length) {
      return res.status(400).json({
        message: "Please select at least one course"
      });
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const updatedStudent =
    await Admission.findByIdAndUpdate(

      req.params.id,

      payload,

      {
        new: true
      }

    );

    res.json(updatedStudent);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

