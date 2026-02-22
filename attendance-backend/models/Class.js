const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name:String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // 🔥 ADD THIS
  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    default: 50,
  },
}, { timestamps: true });

module.exports = mongoose.model("Class", ClassSchema);

