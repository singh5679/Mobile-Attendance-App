const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register
router.post("/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);
  const { name, email, password, role, enrollmentNo } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields including role are required",
    });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role, // 🔥🔥🔥 THIS WAS MISSING
      enrollmentNo: role === "student" ? enrollmentNo : undefined,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN BODY:", req.body);

  const user = await User.findOne({ email });
  console.log("LOGIN USER FOUND:", user?.email, user?.role);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },   // ✅ role included
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

 res.json({
  success: true,
  token,
  user: {
    id: user._id,
    name: user.name,
    role: user.role,
  },
});
});



module.exports = router;