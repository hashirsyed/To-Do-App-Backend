const { Router } = require("express");
const router = Router();

// Routers
const userRouter = require("./user");
const tasksRouter = require("./tasks")

router.use("/users", userRouter);
router.use("/users", tasksRouter)

module.exports = router;
