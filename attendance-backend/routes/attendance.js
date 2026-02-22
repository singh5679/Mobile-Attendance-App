const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
//const GeoFence = require("../models/GeoFence");
const {markAttendance} = require("../controllers/attendanceController");
const attendanceController = require("../controllers/attendanceController");
const Attendance = require("../models/Attendance");

 const mongoose = require("mongoose");


// Mark Attendance 
router.post("/mark", authMiddleware, markAttendance);


//histroy 


router.get("/history", authMiddleware, attendanceController.getHistory);

//summary 
router.get("/summary", authMiddleware, async (req, res) => {
  try {

    const records = await Attendance.find({
      student: req.userId,
    });

    const total = records.length;

    const present = records.filter(
      (r) => r.status === "present"
    ).length;

    const late = records.filter(
      (r) => r.status === "late"
    ).length;

    const absent = records.filter(
      (r) => r.status === "absent"
    ).length;

    const percentage =
      total === 0
        ? 0
        : Math.round(((present + late) / total) * 100);

    res.json({
      total,
      present,
      late,
      absent,
      percentage,
    });

  } catch (err) {
    console.log("SUMMARY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router; 