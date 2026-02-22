const Class = require("../models/Class");
const User = require("../models/User");
/**
 * ✅ Teacher creates class
 */
exports.addClass = async (req, res) => {
  try {
    console.log("CREATE CLASS BODY:", req.body);
    console.log("USER ROLE:", req.userRole);
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Only teacher can create class" });
    }

    const { subject, latitude, longitude, radius } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Location required",
      });
    }

    const newClass = await Class.create({
      teacherId: req.userId,
      subject,
      latitude,
      longitude,
      radius,
      students: [], // 👈 important
    });

    res.json({ success: true, class: newClass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create class" });
  }
};

exports.joinClass = async (req, res) => {
  try {
    if (req.userRole !== "student") {
      return res.status(403).json({ message: "Only students can join class" });
    }
    const classId = req.params.id;
    const studentId = req.userId;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    classData.students.push(studentId);
    await classData.save();

    res.json({ message: "Joined successfully" });
  } catch (err) {
    res.status(500).json({ message: "Join failed" });
  }
};

/**
 * ✅ Get my classes (role based)
 */
exports.getClasses = async (req, res) => {
  try {
    let classes;

    if (req.userRole === "teacher") {
      classes = await Class.find({ teacherId: req.userId }).populate(
        "subject",
        "name",
      );
    } else {
      classes = await Class.find({ students: req.userId }).populate(
        "subject",
        "name",
      );
    }

    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Get all classes (for students to join Screen)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("subject", "name")
      .populate("teacherId", "name");

    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Teacher Screen All students

exports.getStudents = async (req, res) => {
  try {
    if (req.userRole !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teacher can view students" });
    }

    const students = await User.find({
      classId: req.params.classId,
      role: "student",
    }).select("name enrollment email");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

//delete class

exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Only teacher who created class can delete
    if (classData.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Class.findByIdAndDelete(classId);

    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// * ✅ Get Students of Specific Class (Teacher)
//  */
// exports.getStudents = async (req, res) => {
//   try {
//     if (req.userRole !== "teacher") {
//       return res.status(403).json({ message: "Only teacher can view students" });
//     }

//     const classData = await Class.findById(req.params.classId)
//       .populate("students", "name enrollment email");

//     if (!classData) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     res.json(classData.students);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch students" });
//   }
// };


