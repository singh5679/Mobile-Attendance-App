const router = require("express").Router();
const Class = require("../models/Class");
const authMiddleware = require("../middleware/authMiddleware");
const controller= require("../controllers/classController");

//create class(teacher)
router.post("/add", authMiddleware, controller.addClass);
//Get all classes (for students to join)
router.get("/all", authMiddleware, controller.getAllClasses);
//Get my classes (role based)
router.get("/my", authMiddleware, controller.getClasses);
//Join Class(Student)
router.post("/join/:id", authMiddleware, controller.joinClass);
//Teacher Screen All students
router.get("/students/:classId", authMiddleware, controller.getStudents);


//delete class
router.delete("/:id", authMiddleware, controller.deleteClass);


router.post("/assign", authMiddleware, async (req, res) => {
  if (req.userRole !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { classId, studentId } = req.body;

  const classData = await Class.findById(classId);

  classData.students.push(studentId);
  await classData.save();

  res.json({ message: "Student assigned successfully" });
});

// router.get("/my", authMiddleware, async (req, res) => {
//   if (req.userRole !== "student") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const classes = await Class.find({ 
//     students: req.userId
//   }).populate("subject teacherId");

//   res.json(classes);
// });


module.exports = router;