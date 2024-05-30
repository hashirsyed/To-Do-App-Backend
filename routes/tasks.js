const { Router } = require("express");
const router = Router();

// Middlewares

// Controllers
const controller = require("../controllers/tasks");
const auth = require("../middlewares/auth");

// Routes
router.post("/:userId/tasks" , auth , controller.create);
router.get("/:userId/tasks", auth , controller.getAll);

module.exports = router;
