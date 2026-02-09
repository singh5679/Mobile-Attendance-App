const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  // chnage for teacher and student
  enrollmentNo: {
    type: String,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});

module.exports = mongoose.model("User", UserSchema);
