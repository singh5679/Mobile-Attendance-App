const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller= require("../controllers/subjectController");
const Subject = require("../models/Subject");


// Teacher adds subject
router.post("/add", auth, async (req, res) => {
  try {
    if (req.userRole !== "teacher") {
      return res.status(403).json({ message: "Only teacher can add subject" });
    }

    const { name, classId } = req.body;

    const subject = await Subject.create({
      name,
      classId, // 🔥 REQUIRED
    });

    res.json(subject);
  } catch (err) {
  console.log("Subject Create Error:", err);   // 🔥 add this
  res.status(500).json({ 
    message: err.message   // 🔥 send real error
  });
}
});


//delete subject
router.delete("/:id", auth, controller.deleteSubject);

// Get all subjects
router.get("/all", auth, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

module.exports = router;
