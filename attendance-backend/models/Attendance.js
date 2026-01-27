const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  },
  latitude: Number,
  longitude: Number,
  status:{ 
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);