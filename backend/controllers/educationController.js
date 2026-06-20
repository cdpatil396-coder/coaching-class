const Assignment = require("../models/Assignment");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

exports.getAssignments = async (req, res) => {
  try {
    const { batch, course } = req.query;
    const query = {};
    if (batch) query.batch = batch;
    if (course) query.course = course;

    const assignments = await Assignment.find(query).sort({
      createdAt: -1
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      title: normalizeString(req.body.title),
      description: normalizeString(req.body.description),
      batch: normalizeString(req.body.batch),
      course: normalizeString(req.body.course),
      dueDate: normalizeString(req.body.dueDate)
    });

    res.status(201).json({
      message: "Assignment created",
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
