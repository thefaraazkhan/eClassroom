const mongoose = require("mongoose");

const completedAssignmentSchema = new mongoose.Schema({
  parentAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completedFile: String,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  givenMarks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model(
  "completedAssignment",
  completedAssignmentSchema
);
