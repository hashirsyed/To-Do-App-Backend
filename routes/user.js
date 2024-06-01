const { Router } = require("express");
const router = Router();

// Middlewares

// Controllers
const controller = require("../controllers/user");
const auth = require("../middlewares/auth");

// Routes
router.post("/",controller.signUp);
router.post("/login", controller.login);
router.get("/:userId/dashboard",auth,controller.tasksCount)

module.exports = router;
