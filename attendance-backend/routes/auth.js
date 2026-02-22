const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/authController");

const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// serve static folder
// router.use("/uploads", require("express").static("uploads"));

// UPDATE PROFILE WITH IMAGE
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { phone, address, department, course } = req.body;

      const updateData = {
        phone,
        address,
        department,
        course,
      };

      if (req.file) {
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        updateData,
        { new: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);



// Register
router.post("/register", async (req, res) => {
  // console.log("REGISTER BODY:", req.body);
  // const { name, email, password, role, enrollment } = req.body;
  const {
    name,
    email,
    password,
    role,
    enrollment,
    phone,
    address,
    department,
    course,
  } = req.body;

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
      role,
      enrollment: role === "student" ? enrollment : undefined,
      phone,
      address,
      department,
      course,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
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
    { id: user._id, role: user.role }, // ✅ role included
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
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

// GET Logged In User
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollment: user.enrollment,
      phone: user.phone,
      address: user.address,
      department: user.department,
      course: user.course,
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// // UPDATE PROFILE
// router.put("/update-profile", authMiddleware, async (req, res) => {
//   try {
//    // const { phone, address, department, course } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       req.body,
//     // { phone, address, department, course },
//       { new: true }
//     ).select("-password");

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Profile update failed" });
//   }
// });

 router.get("/students", authMiddleware, controller.getAllStudents);

module.exports = router;
