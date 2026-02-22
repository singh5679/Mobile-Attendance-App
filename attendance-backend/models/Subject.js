const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});

module.exports = mongoose.model("Subject", SubjectSchema);
