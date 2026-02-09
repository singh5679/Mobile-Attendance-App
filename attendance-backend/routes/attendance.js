const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
//const GeoFence = require("../models/GeoFence");
const {markAttendance} = require("../controllers/attendanceController");

const Attendance = require("../models/Attendance");

 const mongoose = require("mongoose");


// Mark Attendance 
router.post("/mark", authMiddleware, markAttendance);


//histroy 

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const records = await Attendance.find({ studentId:userId })
      .populate("subjectId", "name")
      .sort({ date: -1 });

    console.log("History user:", userId);
    console.log("Records found:", records.length);

    return res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});



module.exports = router; 