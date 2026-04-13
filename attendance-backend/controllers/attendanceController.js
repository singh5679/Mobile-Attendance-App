const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}

exports.markAttendance = async (req, res) => {
  try {
    const { latitude, longitude, classId } = req.body;
    const userId = req.userId;

    if (!classId) {
      return res.status(400).json({ message: "ClassId required" });
    }

    const student = await User.findById(userId);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // const cls = await Class.findById(classId);
    // // adddddd 
    // const subjectDoc = await Subject.findById(cls.subject);
    
    //new add 13 april
    const cls = await Class.findById(classId).populate("subject");

    if (!cls) {
    return res.status(400).json({ message: "Class not found" });
    }
//

    if (!cls) {
      return res.status(400).json({ message: "Class not found" });
    }

    if (!cls.students.some(id => id.toString() === userId)) {
      return res.status(403).json({ message: "Not enrolled in this class" });
    }

    // ✅ Prevent duplicate attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      student: userId,
      classId,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    // ✅ Calculate distance
    const distance = calculateDistance(
      latitude,
      longitude,
      cls.latitude,
      cls.longitude
    );

    console.log("Distance:", distance);
    console.log("Radius:", cls.radius);

    const boundaryTolerance = 1; // 1 meter tolerance

    let status;
    let locationStatus;

    if (distance < cls.radius - boundaryTolerance) {
      status = "present";
      locationStatus = "INSIDE";
    } 
    else if (
      distance >= cls.radius - boundaryTolerance &&
      distance <= cls.radius + boundaryTolerance
    ) {
      status = "present";
      locationStatus = "BOUNDARY";
    } 
    else {
      status = "absent";
      locationStatus = "OUTSIDE";
    }

    // ✅ Save attendance (always save record)
    const attendance = await Attendance.create({
      student: userId,
      classId,
      subjectId: cls.subject?._id,
      subjectName:cls.subject?.name||"unknown Subject",//addddddd
      latitude,
      longitude,
      status,
      locationStatus,
      distance,
      date: new Date(),
    });

    // return res.status(200).json({
    //   message: "Attendance processed",
    //   status,
    //   locationStatus,
    //   distance,
    //   allowedRadius: cls.radius,
    //   attendanceId: attendance._id,///////
    // });
    return res.status(200).json({
  message: "Attendance processed",
  status,
  locationStatus,
  distance,
  allowedRadius: cls.radius,
   latitude,
   longitude,
  attendanceId: attendance._id,
});

  } catch (error) {
     console.error("MARK ATTENDANCE ERROR:", error);
    res.status(500).json({ message: "Server error" ,error: error.message,
      name: error.name});
  }
};


// Get attendance history for a student
exports.getHistory = async (req, res) => {
  try {
    //console.log("Logged userId:", req.userId);
    //console.log("Logged role:", req.userRole);

    // Only student allowed
    if (req.userRole !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = await Attendance.find({
      student: req.userId
    })
    .populate("subjectId")
    .sort({date : -1,_id: -1});

    console.log("Records found:", records.length);

    res.json(records);

  } catch (err) {
    console.log("History error:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
};
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { today } = req.query;

    // Only teacher allowed
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const cls = await Class.findById(classId).populate("subject");
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }
    //fixed here 
    if(!cls.teacherId){
      return res.status(403).json({message:"Not your class"});
    }

    // Only owner teacher can view
    if (cls.teacherId.toString() !== req.userId.toString()) {//teacherId
      return res.status(403).json({ message: "Not your class" });
    }

    let filter = { classId };

    if (today === "true") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(filter)
      .populate("student", "name email enrollment")
      .populate("subjectId", "name")
      .sort({ date: -1 });

    return res.json({
      classId,
      className: cls.name,
      totalRecords: records.length,
      records,
    });
  } catch (err) {
    console.log("GET CLASS ATTENDANCE ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

