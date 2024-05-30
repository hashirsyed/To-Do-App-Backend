const { Router } = require("express");
const router = Router();

// Middlewares

// Controllers
const controller = require("../controllers/tasks");

// Routes
router.post("/:userId/tasks",controller.create);

module.exports = router;
