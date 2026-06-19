const Admission =
require("../models/Admission");
const User = require("../models/User");

/* Create Admission */

exports.createAdmission =
async (req, res) => {

  try {

    const admission =
    await Admission.create(req.body);

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

    const admission =
    await Admission.findOne({
      email: user.email
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

    const updatedStudent =
    await Admission.findByIdAndUpdate(

      req.params.id,

      req.body,

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

