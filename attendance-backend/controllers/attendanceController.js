const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Subject = require("../models/Subject");
const GeoFence = require("../models/GeoFence");

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
//     const { latitude, longitude } = req.body;
//     const userId = req.userId;

//     // Check if attendance already marked today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const existing = await Attendance.findOne({
//       userId,
//       date: { $gte: today },
//     });

//     if (existing) {
//       return res.status(400).json({ message: "Attendance already marked" });
//     }

//     // Get geo-fence
//     const geo = await GeoFence.findOne();
//     if (!geo) return res.status(400).json({ message: "Geo-fence not found" });

//     const distance = calculateDistance(latitude, longitude, geo.latitude, geo.longitude);
//     if (distance > geo.radius) {
//       return res.status(400).json({ message: "Outside geo-fence", distance });
//     }

//     // Save attendance
//     const attendance = new Attendance({
//       userId:req.userId,
//       latitude,
//       longitude,
//       status: "present",
//       date: new Date(),
//     });

//     await attendance.save();

//     res.json({ message: "Attendance marked successfully", distance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.markAttendance = async (req, res) => {
  try {
    const { latitude, longitude, subjectId } = req.body;
    const userId = req.userId;

    // 1️⃣ Get student
    const student = await User.findById(userId);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Only students can mark attendance" });
    }

    if (!student.classId) {
      return res.status(400).json({ message: "Student not assigned to class" });
    }

    // 2️⃣ Validate subject
    const subject = await Subject.findById(subjectId);
    if (!subject || subject.classId.toString() !== student.classId.toString()) {
      return res.status(400).json({ message: "Invalid subject for this class" });
    }

    // 3️⃣ Today check (SUBJECT-WISE)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      studentId: student._id,
      subjectId,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this subject" });
    }

    // 4️⃣ Geo-fence
    const geo = await GeoFence.findOne();
    if (!geo) return res.status(400).json({ message: "Geo-fence not found" });

    const distance = calculateDistance(
      latitude,
      longitude,
      geo.latitude,
      geo.longitude
    );

    const status = distance <= geo.radius ? "present" : "absent";

    // 5️⃣ Save attendance
    const attendance = new Attendance({
      studentId: student._id,
      classId: student.classId,
      subjectId,
      latitude,
      longitude,
     // distance,
      status,
      date: new Date(),
    });

    await attendance.save();

    res.json({
      message: "Attendance marked successfully",
      status,
      distance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

