const { Router } = require("express");
const router = Router();

// Middlewares

// Controllers
const controller = require("../controllers/user");

// Routes
router.post("/",controller.signUp);
router.post("/login", controller.login);

module.exports = router;
