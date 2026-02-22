const User = require("../models/User");

exports.getAllStudents = async (req, res) => {
  try {
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Only teacher can view students" });
    }

    const students = await User.find({ role: "student" })
      .select("name enrollment email");

    res.json(students);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};



