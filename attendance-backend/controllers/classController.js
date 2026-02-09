const Class = require("../models/Class");

/**
 * ✅ Teacher creates class
 */
exports.addClass = async (req, res) => {
  try {
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Only teacher can create class" });
    }

    const { subject, latitude, longitude, radius } = req.body;

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

/**
 * ✅ Student joins class
 */
exports.joinClass = async (req, res) => {
  try {
    if (req.userRole !== "student") {
      return res.status(403).json({ message: "Only students can join class" });
    }

    // const { classId } = req.body;
    const cls = await Class.findById(req.body.classId);

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const alreadyJoined = cls.students.some(
      (id) => id.toString() === req.userId
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this class" });
    }

    cls.students.push(req.userId);
    await cls.save();

    res.json({ success: true, message: "Class joined successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join class" });
  }
};

/**
 * ✅ Get classes (role based)
 */
exports.getClasses = async (req, res) => {
  try {
    let classes;

    if (req.userRole === "teacher") {
      classes = await Class.find({ teacherId: req.userId }).populate("subject");
    } else {
      classes = await Class.find({ students: req.userId }).populate("subject");
    }

    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

