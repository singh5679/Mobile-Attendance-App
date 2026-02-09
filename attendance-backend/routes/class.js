const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller= require("../controllers/classController");

router.post("/add", auth, controller.addClass);
router.post("/join", auth, controller.joinClass);
router.get("/all", auth, controller.getClasses);

module.exports = router;