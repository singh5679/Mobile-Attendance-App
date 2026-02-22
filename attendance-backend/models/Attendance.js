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
    enum: ['present', 'absent'],
    required: true
  },
  //location status
  locationStatus: {
  type: String,
  enum: ["INSIDE", "OUTSIDE", "BOUNDARY"],
  required: true
},
  classId: {
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

// 🔒 Prevent duplicate attendance
AttendanceSchema.index(
  { student: 1, subjectId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);