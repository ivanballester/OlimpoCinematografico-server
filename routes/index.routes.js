const router = require("express").Router();
const { isAdmin, isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const reviewRouter = require("./reviews.routes");
router.use("/", reviewRouter);

const userRoutes = require("./users.routes");
router.use("/", userRoutes);

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

module.exports = router;
