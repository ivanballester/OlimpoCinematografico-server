const router = require("express").Router();
const { isAdmin } = require("../middleware/jwt.middleware");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const reviewRouter = require("./reviews.routes");
const userRoutes = require("./users.routes");
const authRouter = require("./auth.routes");
const commentRouter = require("./comments.routes");
const profileRouter = require("./profile.routes");

router.use("/", reviewRouter);
router.use("/", userRoutes);
router.use("/auth", authRouter);
router.use("/", commentRouter);
router.use("/", profileRouter);

module.exports = router;
