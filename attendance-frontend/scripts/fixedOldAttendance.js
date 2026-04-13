require("dotenv").config();
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const connectDB = require("../config/db");

async function fixOldAttendance() {
  await connectDB();

  const records = await Attendance.find({
    $or: [
      { subjectName: { $exists: false } },
      { subjectName: "" }
    ]
  });

  console.log("Fixing records:", records.length);

  for (let record of records) {
    if (record.subjectId) {
      const subject = await Subject.findById(record.subjectId);

      if (subject) {
        record.subjectName = subject.name;
      } else {
        record.subjectName = "Deleted Subject"; // 👈 IMPORTANT
      }

      await record.save();
    }
  }

  console.log("✅ Old records fixed");
  process.exit();
}

fixOldAttendance();