// router.post("/class", authMiddleware, teacherOnly, async (req, res) => {
//   const newClass = new Class({
//     name: req.body.name,
//     section: req.body.section,
//     teacherId: req.userId
//   });
//   await newClass.save();
//   res.json(newClass);
// });

router.post("/subject", authMiddleware, teacherOnly, async (req, res) => {
  const subject = new Subject(req.body);
  await subject.save();
  res.json(subject);
});

