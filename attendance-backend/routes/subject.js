const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Subject = require("../models/Subject");

// Teacher adds subject
router.post("/add", auth, async (req, res) => {
  try {
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Only teacher can add subject" });
    }

    const subject = await Subject.create({ name: req.body.name });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: "Failed to create subject" });
  }
});

// Get all subjects
router.get("/all", auth, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

module.exports = router;
