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


// exports.markAttendance = async (req, res) => {
//   try {
//     const { latitude, longitude, classId } = req.body;
//     const userId = req.userId;

//     if (!classId) {
//       return res.status(400).json({ message: "ClassId required" });
//     }

//     const student = await User.findById(userId);
//     if (!student) {
//       return res.status(400).json({ message: "Student not found" });
//     }

//     // ✅ Get class using classId from frontend
//     const cls = await Class.findById(classId);
//     if (!cls) {
//       return res.status(400).json({ message: "Class not found" });
//     }

//     // ✅ Check student is enrolled in this class
//     if (!cls.students.some(id => id.toString() === userId)) {
//       return res.status(403).json({ message: "Not enrolled in this class" });
//     }

//     // ✅ Prevent duplicate attendance (CLASS-WISE)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const existing = await Attendance.findOne({
//       student: userId,
//       classId,
//       date: { $gte: today },
//     });

//     if (existing) {
//       return res.status(400).json({
//         message: "Attendance already marked for today",
//       });
//     }

//     // ✅ Calculate distance
//     const distance = calculateDistance(
//       latitude,
//       longitude,
//       cls.latitude,
//       cls.longitude
//     );

//     console.log("Teacher Location:", cls.latitude, cls.longitude);
//     console.log("Student Location:", latitude, longitude);
//     console.log("Distance:", distance);
//     console.log("Radius:", cls.radius);

//     const status = distance <= cls.radius ? "present" : "absent";

//     // if (distance > cls.radius) {
//     //   return res.status(400).json({
//     //     message: "Outside geo-fence ❌",
//     //     status:"absent",
//     //     distance,
//     //   });
//     // }

//     if (distance > cls.radius) {

//   await Attendance.create({
//     student: userId,
//     classId,
//     subjectId: cls.subject,
//     latitude,
//     longitude,
//     status: "absent",
//     date: new Date(),
//   });

//   return res.status(400).json({
//     message: "Outside geo-fence ❌",
//     status: "absent",
//     distance,
//     allowedRadius: cls.radius,
//   });
// }


//     // // ✅ Save attendance
//     const attendance = await Attendance.create({
//       student: userId,
//       classId,
//       subjectId: cls.subject, // auto get from class
//       latitude,
//       longitude,
//       status,
//       distance,
//       date: new Date(),
//     });

//     res.json({
//       message: "Attendance marked successfully",
//       status,
//       distance,
//       allowedRadius: cls.radius,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

    const cls = await Class.findById(classId);
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
      subjectId: cls.subject,
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
    console.log("Logged userId:", req.userId);
    console.log("Logged role:", req.userRole);

    // Only student allowed
    if (req.userRole !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = await Attendance.find({
      student: req.userId
    }).populate("subjectId");

    console.log("Records found:", records.length);

    res.json(records);

  } catch (err) {
    console.log("History error:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
};



