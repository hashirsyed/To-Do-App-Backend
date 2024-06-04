const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    console.log("HD", file)
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.originalname.split(".")[0]}-${Date.now()}${fileExtension}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// Middlewares

// Controllers
const controller = require("../controllers/user");
const auth = require("../middlewares/auth");

// Routes
router.post("/", controller.signUp);
router.post("/login", controller.login);
router.put("/:userId", upload.single("avatar"), controller.edit);
router.get("/:userId", auth, controller.getMyProfile);
router.get("/:userId/dashboard/statusTasks", auth, controller.statusTasksCount);
router.get("/:userId/dashboard/allTasks", auth, controller.taskCount);

module.exports = router;
