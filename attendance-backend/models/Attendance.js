const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  latitude: Number,
  longitude: Number,
  //distance : Number,
  status:{ 
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  }

});

module.exports = mongoose.model("Attendance", AttendanceSchema);